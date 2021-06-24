Our Vision

To provide a simple to use decentralized social media network, with a familiar interface, free of censorship, advertising and government intervention. 

A platform where all your social media stays right on your computer where you control it and others can request it. No accounts or personal information are required that can be mined and sold to advertisers or shared with 'authorities'.

No subjective community standards, no arbitrary 'fact checking', no blocking or deletion of content, no central 'authority' molding public opinion along their socio-political lines. Users are free to see whatever they want, from whomever they want and they are free to ignore whatever they want. 

By its design it’s impossible for anyone to censor you, serve ads or see your Qaoss timeline without your permission. Everyone runs their own social media timeline on their computer and we connect directly to one another.

Qaoss is an Open Source project built out of the passion for individual freedom and dignity. It's not meant to be a replacement for centralized social media but to complement it, one of many alternatives. 

Qaoss Project Site

http://qaoss.info/ 

Detailed installation instructions with a PowerPoint presentation are on the site.

Installation

1.	Copy the entire qaoss folder and all its contents to a folder on your local computer where you have full access. The "documents" folder works nice.

2.	Run the node-v12.18.2-x64.msi installation program in the qaoss\install folder. Accept all the default settings.

3.	Test your node installation from the command line: C:\node --version It should show: v12.16.3. Switch to the root qaoss folder and type the command ‘npm install’. This will install all the necessary dependencies and can take a minute or two so be patient.

4.	Sign up for an Ngrok Basic account at https://dashboard.ngrok.com/signup. It's $5/month. Once you're signed up Ngrok will provide you with an authentication token. It’s just a long alphanumeric ID.

5.	Go to C:<folder where you copied qaoss files>\qaoss\node_modules\ngrok\bin

6.	Run the following command ngrok authtoken (your authentication token here)
You should see: Authtoken saved to configuration file: ngrok.yml	
7.	Log into your account at ngrok and go to "endpoints" --> "domains" and create a custom domain for yourself.
Eg; "RockAndRoll" or anything you want.
8.	On your computer in the config folder under the qaoss folder modify the config.json to use your custom domain.
{
  "port": "3000",
  "ngrok_url": “(your ngrok domain name here)” Make sure it’s in double quotes
}

9.	Double click the Launch.bat file in the qaoss folder. Your personal social media website should be up and running.
	
10.	Open a browser and type localhost:3000 in the address bar to begin testing.

11.	Go to your browsers “Settings” and configure “Downloads” to ask where to save each time. 


