# Eris Example

## Installation

You can follow the [getting started with eris tutorial](https://docs.erisindustries.com/tutorials/getting-started/) to install the deps and setup your chains.

You should have something that looks like this example app.

If you've done the steps but want to use this example app, clone and use `npm install`

## Usage

Start your permissioned chain.

```bash
# set your chain dir
# make sure docker is set up
docker-machine ls
docker-machine start eris
# you might need to
# docker-machine regenerate-certs eris
# become one with the machine
eval "$(docker-machine env eris)"
eris chains ls
# if you've gone through the eris tutorial you should see your simplechain
eris chains start simplechain
```

Test & deploy contracts

```bash
# set up some variables
chain_dir=~/.eris/chains/simplechain
addr=$(cat $chain_dir/addresses.csv | grep simplechain_full_000 | cut -d ',' -f 1)
echo $addr
# run the epm jobs; test & deploy
eris pkgs do --chain simplechain --address $addr
```

Start the CLI app

```
# get the URL of the container
docker_ip=$(docker-machine ip eris)
export DOCKER_URL=http://${docker_ip}:1337/rpc
# start the node app
node app.js
```
