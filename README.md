# Birthday Automation

To use please alter or make a csv with the headers and arrangement shown in `file.csv`

0. npm i
1. You need to import this file by running the following command in root `node import_date.js file.csv`
2. Run job.js by doing the following `node job.js` this will use todays date and check. If you want to target a specific date (particularly in testing) run the following command ```node job.js date=11 month=3```

There were multiple ways I could have attacked this problem since it did not really require an interaction back and forth having it as an API did not seem like it was worth while for the extra overhead you would have to run it. 

I would run this as a scheduled job in kube or a simple lambda thats triggered every day.

Regarding testing If I had time I would validate that a number can send for example `+44` will be required on all telephone numbers. Also validating the email would be sufficient. Testing for the interactions of functions can be done with simple prop testing on given values and have return a desired result