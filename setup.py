# setup.py - Run once to configure agent controls

import asyncio
from datetime import datetime, UTC
import httpx
from agent_control import AgentControlClient, controls, agents
from agent_control_models import Agent

async def setup():
    async with AgentControlClient() as client:  # Defaults to localhost:8000
        # 1. Register agent first
        agent = Agent(
            agent_name="awesome_bot_3000",
            agent_description="My Chatbot",
            agent_created_at=datetime.now(UTC).isoformat(),
        )
        await agents.register_agent(client, agent, steps=[])

        # 2. Create control (blocks SSN patterns in output), reuse if already exists
        try:
            control = await controls.create_control(
                client,
                name="block-ssn",
                data={
                    "enabled": True,
                    "execution": "server",
                    "scope": {"stages": ["post"]},
                    "condition": {
                        "selector": {"path": "output"},
                        "evaluator": {
                            "name": "regex",
                            "config": {"pattern": r"\b\d{3}-\d{2}-\d{4}\b"},
                        },
                    },
                    "action": {"decision": "deny"},
                },
            )
        except httpx.HTTPStatusError as e:
            if e.response.status_code != 409:
                raise
            existing = await controls.list_controls(client, name="block-ssn")
            found = existing["controls"][0]
            control = {"control_id": found["id"]}
            print("ℹ️  Control 'block-ssn' already exists, reusing it.")

        # 3. Associate control directly with agent
        await agents.add_agent_control(
            client,
            agent_name=agent.agent_name,
            control_id=control["control_id"],
        )

        print("✅ Setup complete!")
        print(f"   Control ID: {control['control_id']}")

asyncio.run(setup())