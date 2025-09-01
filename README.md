# Tridion Docs - Copyleaks Extension(Plagiarism Checker)

This Copyleaks Extension helps to check Plagiarism of the original content within the Tridion Platform using Copyleaks APIs

## Prerequisites

1) Node Js Latest

2) Tridion Docs 15.1
	https://www.rws.com/
	
3) Webhooks server

4) Copyleaks Credentials
	https://copyleaks.com/
	

## Configure


1) Navigate to root directory of the Extension

2) Update the following JSON in copyleaks-addon.config.json file

	EMAIL: "" Copyleaks email Id
	API_KEY : "" API Key for copyleaks scan
	PROXY_SERVER_BASE_URL : "" proxy server url
	WEB_HOOKS_URL : "" webhooks url from proxy server
	WEB_HOOKS_NEWRESULT :"" webhooks url from proxy server

```json
	
	{
    		"configuration": {
			"copyleaks-extension": {            
            			"EMAIL":"",
            			"API_KEY":"",
				"PROXY_SERVER_BASE_URL":"http://localhost:5000",
            			"WEB_HOOKS_URL":"https://domain.com/webhooks",
            			"WEB_HOOKS_NEWRESULT":"https://domain.com/newResult"
       	 		}
    		}
	}

```
3) Navigate to Access Management Application tab and click on Tridion Docs Organize Space and enter Allowed redirect URLS as below
	
	https://localhost:3010/ISHCS/OrganizeSpace/signin-oidc

	https://localhost:3010/ISHCS/OrganizeSpace/signout-callback-oidc

	
4) Update the target(Tridion Docs organize space) URL in package.json file as below
	
```json
	"dev": "webpack serve --config ./webpack.dev.config.js --progress --env target=https://domain.com manifest=../manifest.json config=../copyleaks-addon.config"
```
	
	
	target = https://domain.com (Tridion Docs organize space url)
		

## Installation


1) Navigate to copyleaks-extension folder and run the below command to install node module dependencies 
	
	npm install
	
	
	
## Usage

 
To run the application locally:


1) Navigate to copyleaks-extension folder and run the command 
	
		npm run dev
		
2) Browse the url https://localhost:3010/ISHCS/OrganizeSpace/

3) Open the publication and navigate to Topics folder

4) Select the Topics 

5) After selecting the Topics the copyleaks scan properties icon will appear on the right side panel 

6) Click on the icon

7) This checks the Topics content for copyleaks. if the Topic is already scanned for copyleaks plagiarism-checker

8) If the Topics content is not scanned already, click on the scan component button 

9) After clicking on the scan component it will take some time get the results using the webhooks 

10) Once the results are available from the webhooks you can check the copyleaked content details



## Deploy


Deploy the extension to Tridion Docs


1) Navigate to copyleaks-extension folder and run the following command to build and pack the extension

	npm run build
	
	npm run pack
	
	
2) Navigate to addons repository folder

	e.g: C:\Docs\InfoShare\Data\Addons\Repository

3) Copy the zip created in above step 1 and copyleaks-addon.config file to repository folder

4) This should enable the uploaded addon file(copyleaks extension) and can be checked by navigating to Tridion Docs Organize space Topics folder.


# Webhooks Server


## Setup

1) Navigate to copyleaks-webhooks-server and run the command npm install to install node dependency modules

2) Run the command node app.js to start the webhooks proxy server
	
	

 	
	
