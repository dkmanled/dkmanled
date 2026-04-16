from playwright.sync_api import sync_playwright
import os
import time

def run_cuj(page):
    page.goto("http://localhost:5001")
    page.wait_for_timeout(2000)

    # Check metrics using correct IDs
    total_leads = page.locator("#stat-total").inner_text()
    print(f"Total Leads: {total_leads}")

    # Click on "APTO SHOW" filter
    page.click("#filter-apto")
    page.wait_for_timeout(1000)

    # Take screenshot of filtered view
    page.screenshot(path="/home/jules/verification/screenshots/bouncers_filtered.png")

    # Click on "DISCOTEQUES" filter
    page.click("#filter-disco")
    page.wait_for_timeout(1000)

    # Take screenshot of final view
    page.screenshot(path="/home/jules/verification/screenshots/bouncers_final.png")
    page.wait_for_timeout(1000)

if __name__ == "__main__":
    os.makedirs("/home/jules/verification/videos", exist_ok=True)
    os.makedirs("/home/jules/verification/screenshots", exist_ok=True)
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            record_video_dir="/home/jules/verification/videos"
        )
        page = context.new_page()
        try:
            run_cuj(page)
        finally:
            context.close()
            browser.close()
