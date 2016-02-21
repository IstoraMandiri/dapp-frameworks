#Marbles Part 1 - Demo

##BEFORE YOU RUN
- The underlying network for this application is the open blockchain fabric code that was contributed by IBM to the Linux Foundation's Hyperledger project. They have extensive [Fabric Documentation](https://github.com/openblockchain/obc-docs)
- The expectations of this application are to test the JS SDK, guide its development and to aid a developer become familiar with our SDK + chaincode.
- This is a `very simple` asset transfer demonstration.  Two users can create and exchange marbles with each other.
- There will be multiple parts. Part 1 and 2 are complete  [2/15/2016]
- The chaincode is not in this repo, it can be found here: [https://github.com/ibm-blockchain/marbles-chaincode](hhttps://github.com/ibm-blockchain/marbles-chaincode)

***

##Part 1 Goals
- User can create a marble and store it in the chaincode state
- User can read and display all marbles in the chaincode state
- User can transfer marble to another user
- User can delete a marble
- User can see when a new block is written to the ledger
- Deployable on Bluemix

***

#Prereq:
1. Bluemix ID https://console.ng.bluemix.net/ (needed to create your IBM Blockchain network)
1. Node JS 0.12+ (only needed if you want to run the app locally)
1. GoLang Environment (only needed to build your own chaincode, not needed if you just run the marbles app as is)
1. You are at least partially aware of the term 'chaincode', 'ledger', and 'peer' in a blockchain context. [Term Help](https://github.com/openblockchain/obc-docs/blob/master/glossary.md)


#Application Background
This sample app is meant to demonstrate how to create and transfer marbles between two users. 
We are going to do this in Node.JS and a bit of GoLang. 
The backend of this application will be the GoLang code running in our blockchain network. 
From here on out the GoLang code will be referred to as 'chaincode' or 'cc'. 
The chaincode itself will create a marble by storing it to the chaincode state. 
The chaincode itself is able to store data as a string in a key/value pair setup. 
Thus we will stringify JSON objects to store more complex structures. 

Attributes of a marble:

	1. name (unique string, will be used as key)
	1. color (string, css color names)
	1. size (int, size in mm)
	1. user (string)
	
We are going to create a Web UI that can set these values and pass them to the chaincode. 
Interacting with the cc is done with a HTTP REST call to a peer on the network. 
The ibc-js SDK will abstract the details of the REST calls away.
This allow us to use dot notation to call our GoLang functions (such as `chaincode.init_marble(args)`).

#Application Communication Flow

1. The user will interact with our Node.js application
1. This client side JS code will open a websocket to the backend Node.js application
1. The backend Node.js will send HTTP requests (via the SDK) to a blockchain peer
1. The peer will communicate to its chaincode container at its leisure. Note that the previous HTTP request was really a 'submission' of chaincode to be run, it will actually run at a later date.
1. The cc container will carry out the desired operation

#Chaincode
To understand what is going on we need to start looking at the chaincode.  The complete cc code for this example can be found [here](https://github.com/ibm-blockchain/marbles-chaincode/blob/master/part1/chaincode_ex.go). 
Marbles Part 1 and Marbles Part 2 will use different chaincode, but Part 2 will include everything from Part 1. 
Part 1 is just nicer to look at since it has less lines of code, and hopefully less things to confuse you on. 
It is perfectly fine to use Part 2's chaincode with the Marbles Part 1 web application.
	
The first interesting place in the cc is the `Run()` function. 
This is our entry point into chaincode. 
IE the peer will call this function for any type of "invocation". 
"Invoking" a function simply means we are attempting to run a cc function and that this event will be recorded to the blockchain ledger.
A counter example to an invoke operation would be a query operation.  Query events do not get recorded to the ledger.

Looking at the example code it should be clear that we can invoke our GoLang functions by detecting the desired function name and passing to that function the argument `args`.

__Run()__

```js
	// ============================================================================================================================
	// Run - Our entry point
	// ============================================================================================================================
	func (t *SimpleChaincode) Run(stub *shim.ChaincodeStub, function string, args []string) ([]byte, error) {
		fmt.Println("run is running " + function)

		// Handle different functions
		if function == "init" {               //initialize the chaincode state, used as reset
			return t.init(stub, args)
		} else if function == "delete" {      //deletes an entity from its state
			return t.Delete(stub, args)
		} else if function == "write" {       //writes a value to the chaincode state
			return t.Write(stub, args)
		} else if function == "init_marble" { //create a new marble
			return t.init_marble(stub, args)
		} else if function == "set_user" {    //change owner of a marble
			return t.set_user(stub, args)
		}
		fmt.Println("run did not find func: " + function) //error

		return nil, errors.New("Received unknown function invocation")
	}
```

The SDK we have built will be able to find the names of the functions listed in Run(). 
It will then give you a dot notation to use them in your Node.js application. ie:
	
```js
	chaincode.read("abc");               //calls the Query() function which will read the var "abc"
	chaincode.write("stuff", "test");    //invokes the cc funciton Write() function which will write test to "stuff" in the cc state
	chaincode.rule_the_world("tomrrow"); //invokes the cc function "rule_the_world" (assuming it exists)
```

Note that the `chaincode.read()` will call the `Query()` function in our chaincode. 
This function is not listed in `Run()` because it is a special function. 
The code for my `Query()` is listed below:

__Query()__

```js
	// ============================================================================================================================
	// Query - read a variable from chaincode state - (aka read)
	// ============================================================================================================================
	func (t *SimpleChaincode) Query(stub *shim.ChaincodeStub, function string, args []string) ([]byte, error) {
		if function != "query" {
			return nil, errors.New("Invalid query function name. Expecting \"query\"")
		}
		var name, jsonResp string
		var err error

		if len(args) != 1 {
			return nil, errors.New("Incorrect number of arguments. Expecting name of the person to query")
		}

		name = args[0]
		valAsbytes, err := stub.GetState(name)              //get the var from chaincode state
		if err != nil {
			jsonResp = "{\"Error\":\"Failed to get state for " + name + "\"}"
			return nil, errors.New(jsonResp)
		}

		return valAsbytes, nil                              //send it onward
	}
```

The `Query()` function gives us some insight to how variables are retrieved from cc state. 
It is a simple matter of using `stub.GetState()` to fetch the value from the key/value pair.
The return value of query is an array of bytes. 
This array gets passed to the peer's REST API code which will format it into a JSON string for the response. 
Please note that all chaincode must have a Query() function. 
I would suggest you simply copy this one if you plan to build your own cc. 


__Write()__

```js
	// ============================================================================================================================
	// Write - write variable into chaincode state
	// ============================================================================================================================
	func (t *SimpleChaincode) Write(stub *shim.ChaincodeStub, args []string) ([]byte, error) {
		var name, value string
		var err error
		fmt.Println("running write()")

		if len(args) != 2 {
			return nil, errors.New("Incorrect number of arguments. Expecting 2. name of the variable and value to set")
		}

		name = args[0]                            //rename for funsies
		value = args[1]
		err = stub.PutState(name, []byte(value))  //write the variable into the chaincode state
		if err != nil {
			return nil, err
		}
		return nil, nil
	}
```

The `Write()` function is equally simple but unlike query, write is found in our `Run()` list. 
`Write()` uses `stub.PutState(name, value)` to store the key/value pair. 
Note that the name is a string, and that value is an array of bytes. 
Most of the chaincode we will create will mimic parts of query or parts of write. 

What I mean by that is that we will use `PutState()` and `GetState()` as the basic building blocks for any cc functions we need to create. 
Marbles is going to use something that I'm going to call a "monolithic chaincode model". 
It just means we will have 1 chaincode for the entire app. 
Individual marbles and anything else we need will live inside this single chaincode’s state space. 
Of course there are much more complicated architectures you can create with a blockchain network. 
I wanted to start here with the simplest one I could think of. 
We will take a look at writting more specific chaincode after we get an environment setup. 

# Setup Options:
So the cc is great and all but first we need a blockchain network. 
Choose 1 option below:

(1) Deploy the app on my local machine and create a network [manually](#Network) 

`OR`

(2) Deploy the app and network at once on Bluemix.  Simply click this button &nbsp;&nbsp; 
[![Deploy to Bluemix](https://bluemix.net/deploy/button.png)](https://bluemix.net/deploy?repository=https://github.com/ibm-blockchain/marbles.git)
then continue [here](#run)


# <a name="network"></a>Manual Network Setup:
We have a Bluemix tile that can create you your own personal network at the push of a button.

1. First login to Bluemix [Bluemix](https://console.ng.bluemix.net)
1. Click "Catalog" or click [here](https://console.ng.bluemix.net/catalog)
1. Scroll to the bottom and click the experimental link or click [here](https://console.ng.bluemix.net/catalog/labs/)
1. Find and click the IBM Blockchain - Experimental tile (you can use the navgiation on the left to filter the list: Services > Network)
1. Choose any space from the "Space:" dropdown (dealers choice)
1. Leave the "App:" field as "Leave unbound" (unless you already have an application, but you probably don't yet)
1. Change the "Service name" to "myblockchain" without the quotes
1. Leave the "Credential name" field as its default value
1. Leave the "Selected Plan" as its default value
1. Click the "CREATE" button
1. Wait for it to bring up your network, if all goes well you should be on the manage screen for your new service
1. Click the "LAUNCH" button to see the dashboard for your network. You should see a few peers.
	- from here you can monitor if your peers crash, if the chaincode containers are running, and logs for all

(Note if you find yourself on the Bluemix Dashboard and want to get back to the service screen just click the tile name "myblockchain" in the "Services" section)

The network is all setup.  Now we need to copy the peer data and pass it to our application (only need this step if we run the app locally).

1. Click the "myblockchain" tile in you Bluemix Dashboard
1. Click the "Service Credentials" link on the left
1. Copy the value of the whole JSON object to the `manual` var in app.js at line 135ish.
	1. If for some reason you don't see any credentials click the "ADD CREDENTIALS" button and let the page refresh

#Run Marbles on Local Machine
Now we are ready to work on the application! 
The app is setup to either grab network data from Bluemix via VCAP Service's environmental variable OR to load the hard coded list in `./app.js`. 
Since we are running the app locally it will not find VCAP and will use the hard coded list. 
You should have replaced the hard coded data with your personal network data in the last section. 
If you haven't, go ahead and do it now (instuctions are [above](#network)).

1. First up we need to install our dependencies. Open a command prompt/terminal and browse to the root of this project.
1. In the command prompt type:
	
		> npm install  
		> gulp
		
1. If all goes well you should see this message in the console:
	
		--------------------------------- Server Up - localhost:3000 ------------------------------------
		
1. The app is already coded to auto deploy the chaincode.  You should see further message about it deploying.
 **[IMPORTANT]** You will need to wait about 60 seconds for the application to fully deploy our cc.
 
1. Make sure you wait for this all clear message. 
		
		[ibc-js] Deploying Chaincode - Complete
		---------------------------------------- Websocket Up ------------------------------------------
		
#Run Marbles on Bluemix (command line)
1. This app is already ready to run on Bluemix
1. If you don't already have one, create a new network for the app
1. Edit manifest.yml 
	- change the service name to match your network's service name, or remove the line if you don't want the app to bind to the service
	- change the app name and host name since "marbles" is taken
1. Push the application by opening a command prompt and browsing to this directory
	
	
	> cf login  
	> (follow the prompts)  
	> cf push YOUR_APP_NAME_HERE  
	
1. The application will bind to the service "myblockchain" and grab the peer data from VCAP_SERVICES. Code for this is in app.js line 209ish

#<a name="run"></a>Use Marbles App
1. Open up your browser and browse to [http://localhost:3000](http://localhost:3000) or your Bluemix www route.
1. You should be staring at our Marbles Part 1 application
	- Part 2 can be found at [http://localhost:3000/p2](http://localhost:3000/p2), but lets stay on Part 1 for now  
1. Finally we can test the application. Click the "Create" link on the top navigation bar
1. Fill out all the fields, then click the "Create" button
1. It should have flipped you back to "Home" and you should see that a new marble has been created
	- If not click the "Home" tab again or refresh the page
1. Next lets trade a marble.  Click and drag one marble from one person's list to another. It should temporary disappear and then auto reload the marbles in their new state. 
	- If not refresh the page

#SDK / IBM Blockchain Deeper Dive
Before we examine how marbles works lets examine what the SDK did to get our cc onto the network.
The options argument for `ibc.load(options)` contains many important things. 
An abreviated version is below:

```js
	//note the marbles code will populates network.peers & network.users from VCAP Services (an env variable when running the app in Bluemix)
	var options = 	{
		network:{
			peers:   [{
				"api_host": "xxx.xxx.xxx.xxx",
				"api_port": "xxxxx",
				"api_url": "http://xxx.xxx.xxx.xxx:xxxxx"
				"id": "xxxxxx-xxxx-xxx-xxx-xxxxxxxxxxxx_vpx",
			}],
			users:  [{
				"username": "user1",
				"secret": "xxxxxxxx"
			}]
		},
		chaincode:{
			zip_url: 'https://github.com/ibm-blockchain/marbles-chaincode/archive/master.zip', //http/https of a link to download zip
			unzip_dir: 'marbles-chaincode-master/part2',                                    //name/path to folder that contains the chaincode you want to deploy (path relative to unzipped root)
			git_url: 'https://github.com/ibm-blockchain/marbles-chaincode/part2',           //git https URL. should point to the desired chaincode repo AND directory
		}
	};
	ibc.load(options, cb);
```

This network has membership security; we can tell because there are usernames/secrets in the network.users list. 
Therefore the first step is we need to use the /registrar endpoint to register a username with a peer. 
The SDK will first parse the network.peers[] and network.users[] and run 1 register HTTP request per peer. 
The details of all rest calls are taken care of by the SDK but if you are curious we have [Swagger Documentation](http://ibmblockchainapi.mybluemix.net/) on the IBM Blockchain REST interface. 
At the end of this step we are ready to deploy our chaincode. 

Before we deploy though, the SDK will download and parse the chaincode. 
This is when it builds up the dot notation we can use to ultimately call cc functions from JS. 
Once its done downloading/parsing it runs the /devops/deploy HTTP request. 
We should receive a hash in the response that is unique to this chaincode. 
This hash will be used along with the registered username in all future invocations / queries against this cc. 


#Marbles Deeper Dive
Hopefully you have successfully traded a marble or two between users. 
Lets look at how this was done by starting at the chaincode.

__set_user()__

```js
	type Marble struct{
		Name string `json:"name"`
		Color string `json:"color"`
		Size int `json:"size"`
		User string `json:"user"`
	}

	// ============================================================================================================================
	// Set User Permission on Marble
	// ============================================================================================================================
	func (t *SimpleChaincode) set_user(stub *shim.ChaincodeStub, args []string) ([]byte, error) {
		var err error
		
		//   0       1
		// "name", "bob"
		if len(args) < 2 {
			return nil, errors.New("Incorrect number of arguments. Expecting 2")
		}
		
		fmt.Println("- start set user")
		fmt.Println(args[0] + " - " + args[1])
		marbleAsBytes, err := stub.GetState(args[0])
		if err != nil {
			return nil, errors.New("Failed to get thing")
		}
		res := Marble{}
		json.Unmarshal(marbleAsBytes, &res)       //un stringify it aka JSON.parse()
		res.User = args[1]                        //change the user
		
		jsonAsBytes, _ := json.Marshal(res)
		err = stub.PutState(args[0], jsonAsBytes) //rewrite the marble with id as key
		if err != nil {
			return nil, err
		}
		
		fmt.Println("- end set user")
		return nil, nil
	}
```

This `set_user()` function takes in an array of strings argument. 
Within the array the first index should have the name of the marble key/value pair. 
We retrieve the marble's struct with `stub.GetState(args[0])` and then unmarshal it into a Marble structure. 
From there we can index into the structure with `res.User` and overwrite the marble's owner with the new username.
Next we Marshal the structure back up so that we can use `stub.PutState()` to overwrite the marble with its new details. 

This is a `very` simplistic way to change ownership of an asset. 
The concept of an "owner" is simply the value of a string inside the marble's structure. 
We will explore more sophisticated methods in Marbles Part 3.


Lets take 1 step up and look at how this chaincode was called from our node.js app. 

__/utils/ws_part1.js__

```js
	module.exports.process_msg = function(ws, data){
		if(data.v == 1){
			if(data.type == 'create'){
				console.log('its a create!');
				chaincode.init_marble([data.name, data.color, data.size, data.user], cb_invoked);
			}
			else if(data.type == 'get'){
				console.log('get marbles msg');
				get_marbles();
			}
			else if(data.type == 'transfer'){
				console.log('transfering msg');
				chaincode.set_user([data.name, data.user]);
			}
		...
```

The `chaincode.set_user([data.name, data.user]);` line is where we submit our request to run the chaincode function. 
It is passing to our GoLang set_user function an array of strings argument containing the name of the marble and the name of it's new owner. 
By "passing" I mean it is really sending a HTTP POST /devops/invoke request to one of the peers in our network. 
This peer will in turn call the chaincode and actually pass the argument to the cc function. 
The details of which peer and the exact rest call are taken care of in our ibc-js SDK. 
For your own curisoity the details of the Invoke API call can be found [here](https://github.com/openblockchain/obc-docs/blob/master/api/Openchain%20API.md#devops)
This code itself was called in response to a websocket message that originated on our user's browser.

Pretty simple, now lets look 1 more step up to how we sent this websocket message.

__/public/js/part1.js__

```js
	$("#user2wrap").droppable({drop:
		function( event, ui ) {
			var user = $(ui.draggable).attr('user');
			if(user.toLowerCase() != bag.setup.USER2){
				$(ui.draggable).addClass("invalid");		//make the marble transparent to reflect a pending action
				transfer($(ui.draggable).attr('id'), bag.setup.USER2);
			}
		}
	});
	
	function transfer(marbleName, user){
		if(marbleName){
			console.log('transfering', marbleName);
			var obj = 	{
							type: "transfer",
							name: marbleName,
							user: user,
							v: 1
						};
			ws.send(JSON.stringify(obj));
			showHomePanel();
		}
	}
```

We used jQuery and jQuery-UI to implement the drag and drop functionality. 
With these tools we get a droppable event trigger. 
In the above code we have attached it to #user2wrap and #user1wrap div elements. 
When the event fires we first check to see if this marble actually moved owners, or if it was just picked up and dropped back down. 
If its owner has changed we go off to the `transfer()` function.
This function creates a json message with all the needed data and uses our websocket to send it with `ws.send()`.

Thats it! Hope you had fun trading some marbles.


#General Trouble Shooting
Plleeease try each trouble shooting method below!

1. If you can't get the app to reflect a new change try refreshing the browser
1. Use the dashboard on the Bluemix service tile to verify if the chaincode was deployed and that your peers are running. You may get into the chaincode/peer logs from here.
	- If there is no chaincode listed, get into the logs and figure out what happened
1. Look at the node.js console logs for clues/errors (if using Bluemix do cf logs YOUR_APP_NAME, if localhost look at your screen buddy)
	- If you want to see recent but historic logs when using Bluemix type cf logs YOUR_APP_NAME --recent in your command line/terminal
	- The logs that are most helpful are right at the begining. After the ------------ Server Up - x.x.x.x:xxxx ------------ line.
1. Open the console in your browser (right click the page, inspect element, open console tab). There are lots of debug prints to help give you clues.
1. If it still doesn't work try deleting the current network and creating another one

#Node.js Console Error Solutions

1. **500 - ECONNREFUSED** - Check the peers in your options.network.peers.  They likely do not exist / are wrong
1. **400 - Must supply username for chaincode** - Check if you see a "Register - failure: userx 401" message.  if so delete and remake the network
1. **401 - Register - failure** - Check the logs of the CA / peer.  If they mention something about an expired certificate delete and remake the network. Logs can be found on the dashboard for the network on Bluemix.
1. **400 - Error gettin chaincode package bytes:...** - Check the options.chaincode.git_url, it is likely incorrect
1. **fs readdir Error** - Check the `options.chaincode.unzip_dir` and `zip_url`. Manually download the git repo using the `options.chaincode.zip_url` then extract it.  the `gir_dir` var should be the exact relative path to get to the desired cc folder
