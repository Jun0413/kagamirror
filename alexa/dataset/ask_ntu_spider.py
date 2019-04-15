###############################################################################
# author: zeng junhao
# date: 02/10/2018
#
###############################################################################

from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException

driver = webdriver.Chrome()
driver.get("http://askntu.ntu.edu.sg/home/ntu_wide/ExploreFaq.aspx")

elements = driver.find_elements(By.CSS_SELECTOR, '.rtIn')
num_elements = len(elements)

fp = open("ask_ntu_scraped.log", "w")

# def clean_text(text):
# 	pass

for i, e in enumerate(elements):
	
	e.click()

	print('[processing] {0} / {1}'.format(i, num_elements))

	try:
		questions = WebDriverWait(driver, 10).until(
			EC.presence_of_all_elements_located((By.XPATH, '//*[@class="categoryLinksSmall"]/div[1]'))
		)
	except TimeoutException as err:
		fp.write('#{0} {1}\n'.format(i, e.get_attribute('innerHTML')))
		fp.write("##0 \nno questions\n")
		continue

	for q in questions:
		q.click()

	answers = WebDriverWait(driver, 10).until(
		EC.presence_of_all_elements_located((By.CSS_SELECTOR, '.answerlink.show'))
	)

	assert len(questions) == len(answers)

	fp.write('#{0} {1}\n'.format(i, e.get_attribute('innerHTML')))

	for j in range(0, len(questions)):
		fp.write('##{0} \n'.format(j))
		fp.write('question:\n{0}\n'.format(questions[j].text))
		fp.write('{0}\n'.format(answers[j].text))

driver.quit()
fp.close()