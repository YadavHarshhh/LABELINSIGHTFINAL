import logging
import re
import time
from bs4 import BeautifulSoup
import pandas as pd
from selenium import webdriver
from selenium.common.exceptions import WebDriverException

def scrape_url_data(driver, url):
    print(f"Scraping data for URL: {url}")
    try:
        driver.get(url)
        soup = BeautifulSoup(driver.page_source, 'html.parser')
        data = {}

        product_name_element = soup.find('h1', class_='Description___StyledH-sc-82a36a-2 bofYPK')
        if product_name_element:
            data["product_name"] = product_name_element.text
            print("Product name found")
        else:
            logging.warning(f"Product name not found for URL: {url}")
            data["product_name"] = "Not Found"

        details = soup.findAll('div', class_="MoreDetails___StyledDiv-sc-1h9rbjh-0")
        for detail in details:
            title_element = detail.find("span", class_="Label-sc-15v1nk5-0")
            title = title_element.text if title_element else None

            if title == "Ingredients":
                ingredients_element = detail.find("div", style="font-family: 'ProximaNova-Regular';font-size:13px;line-height: 18px;color:8f8f8f;")
                data["Ingredients"] = ingredients_element.text.replace('\n', '').strip() if ingredients_element else "Not Found"
                print("Ingredients found")
            elif title == "Nutritional Facts":
                nutritional_element = detail.find("div", style="font-family: 'ProximaNova-Regular';font-size:13px;line-height: 18px;color:8f8f8f;")
                data["Nutritional"] = nutritional_element.text.replace('\n', '').strip() if nutritional_element else "Not Found"
                print("Nutritional Facts found")
            elif title == "About the Product":
                about_element = detail.find("div", style="font-family: 'ProximaNova-Regular';font-size:13px;line-height: 18px;color:8f8f8f;")
                data["About"] = about_element.text.replace('\n', '').strip() if about_element else "Not Found"
                print("About the Product found")
            elif title == "Other Product Info":
                txt_element = detail.find("div", style="font-family: 'ProximaNova-Regular';font-size:13px;line-height: 18px;color:8f8f8f;")
                txt = txt_element.text.strip() if txt_element else ""
                match = re.search(r'EAN Code: ?(\d+)', txt)
                if match:
                    data["EAN"] = match.group(1)
                    print("EAN Code found")
                else:
                    data["EAN"] = "Not Found"

        return data

    except Exception as e:
        logging.error(f"Error scraping URL {url}: {e}")
        return {}
 
def main():
    final_data = []
    products_url = []
    missed_url = []

    try:
        print("Initializing WebDriver")
        driver = webdriver.Chrome()
    except WebDriverException as e:
        logging.error(f"Error initializing WebDriver: {e}")
        return

    try:
        for i in range(1, 194):
            base_url = f"https://www.bigbasket.com/cl/snacks-branded-foods/?nc=nb&page={i}"
            print(f"Accessing base URL: {base_url}")

            try:
                driver.get(base_url)
                soup = BeautifulSoup(driver.page_source, 'html.parser')
                ul_element = soup.find('ul', class_='mt-5 grid gap-6 grid-cols-9')
                links = ul_element.find_all('a', attrs={"target": "_blank"})

                if links:
                    for link in links:
                        href = link.get('href')
                        products_url.append("https://www.bigbasket.com/" + href)
                else:
                    print("Links not found for: ", base_url)
                    missed_url.append(base_url)
                    continue

            except WebDriverException as e:
                print(f"Error processing {base_url}: {e}")
                driver.close()
                print("Initializing new WebDriver")
                driver = webdriver.Chrome()
                time.sleep(1)
                driver.get(base_url)
                soup = BeautifulSoup(driver.page_source, 'html.parser')
                ul_element = soup.find('ul', class_='mt-5 grid gap-6 grid-cols-9')
                links = ul_element.find_all('a', attrs={"target": "_blank"})

                if links:
                    for link in links:
                        href = link.get('href')
                        products_url.append("https://www.bigbasket.com/" + href)
                else:
                    print("Links not found for: ", base_url)
                    missed_url.append(base_url)
                    continue

            print(f"Found {len(products_url)} product URLs")

        for product in products_url:
            product_data = scrape_url_data(driver, product)
            final_data.append(product_data)

    except Exception as e:
        logging.error(f"Error during main processing: {e}")

    finally:
        driver.close()
        print("WebDriver closed")
        print("Missed URLs: ", missed_url)

    try:
        df = pd.DataFrame(final_data)
        df.to_csv('data.csv', index=False)
        print("Data written to CSV")
    except Exception as e:
        logging.error(f"Error writing to CSV: {e}")


if __name__ == "__main__":
    main()
