import asyncio
from playwright.async_api import async_playwright

async def verify_bouncers():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()

        # Navigate to the app
        await page.goto("http://localhost:5001")

        # Wait for the results to load
        await page.wait_for_selector(".card-boliche")

        # Take a screenshot
        await page.set_viewport_size({"width": 1280, "height": 1200})
        await page.screenshot(path="bouncers_verification_full.png")

        # Check if the test record is present
        content = await page.content()
        if "Boliche Test" in content:
            print("Verification Successful: Test record found.")
        else:
            print("Verification Failed: Test record not found.")

        if "Juan Perez" in content:
            print("Verification Successful: Contact name found.")
        else:
            print("Verification Failed: Contact name not found.")

        if "Twitter/X" in content:
            print("Verification Successful: Twitter link found.")
        else:
            print("Verification Failed: Twitter link not found.")

        # Check filters
        await page.check("#filter-apto")
        # Wait a bit for JS to filter
        await asyncio.sleep(1)

        # Verify it's still there (since it's apto_show=1)
        if "Boliche Test" in await page.inner_text("#results-list"):
             print("Filter Test (Apto): Success")
        else:
             print("Filter Test (Apto): Failed")

        browser.close()

if __name__ == "__main__":
    asyncio.run(verify_bouncers())
