# my_agent.py

import asyncio
import agent_control
from agent_control import control, ControlViolationError

agent_control.init(
    agent_name="awesome_bot_3000",
    agent_description="My Chatbot",
)

@control()
async def assign_credit(amount: int, user_id: str) -> str:
    # Simulates an LLM/agent deciding to assign credits to a user.
    # The guardrail checks the output and blocks assignments over 50.
    return f"Approved: assigning {amount} credits to {user_id}. Routing to billing system."

async def main():
    print("--- Test 1: Assigning 20 credits (should be ALLOWED) ---")
    try:
        result = await assign_credit(20, "user_42")
        print(f"✅ {result}")
    except ControlViolationError as e:
        print(f"❌ Blocked by: {e.control_name}")

    print("\n--- Test 2: Assigning 100 credits (should be BLOCKED) ---")
    try:
        result = await assign_credit(100, "user_42")
        print(f"✅ {result}")
    except ControlViolationError as e:
        print(f"❌ Blocked by: {e.control_name} → escalating to human agent")

    await agent_control.ashutdown()

if __name__ == "__main__":
    asyncio.run(main())
