# No Framework Example

This example shows the 'bare minimalist' approach to deploying a Dapp; a simple JS app that deploys from the browser.

## Installation

If you've followed the steps in `../README.md` you're good to go.

## Usage

Start geth on a testnet

```bash
cd examples/0_No_Framework
geth --networkid 1332 --minerthreads 1 --datadir "/tmp/no-framework-test" --genesis test-genesis.json --rpc --rpccorsdomain '*'
```

If you are running your node remote, add the following options:

```bash
# NB: This is super insecure if you have disabled your firewall; use your actual IP
--rpcaddr "0.0.0.0"
```

Attach a console in a new terminal window

```bash
geth attach ipc://tmp/no-framework-test/geth.ipc
```

Create a a new account, set it as the etherbase and unlock it

```javascript
# remember the password!
myAccount = personal.newAccount()
# check it has updated the coinbase (aka etherbase)
miner.setEtherbase(myAccount)
# unlock the acccount
personal.unlockAccount(myAccount)
# start start mining
miner.start()
```

Wait for your DAG to be generated.

Now just open up `index.html` and play around.
