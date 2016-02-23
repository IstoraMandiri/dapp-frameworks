# Dapp Frameworks Playground

Watch the talk on youtube: https://www.youtube.com/watch?v=XdPkzzjmirw

### A collection of usage examples of Dapp Development Frameworks

This repository complements the 'Dapp Frameworks' talk by Chris Hitchcott on 22nd Feb 2016.

## What's included

* Presentation Deck `dapp_frameworks.key`
* Examples `/examples`
  * No Framework
  * Embark
  * meteor-embark
  * Truffle
  * Dapple
  * Eris
  * BlockApps
  * Bluemix

## Prerequisites

You'll need `node` and it will be used in 2 different versions.

Install `node version manager` and `node 0.12`. We'll install `node 5` in example 5

```bash
# install node version manager
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.31.0/install.sh | bash
# Add these lines to your ~/.profile
#
#     export NVM_DIR="$HOME/.nvm"
#     [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh" # This loads nvm
#
# close and re-open your terminal, then
# install and use node 0.12.x
nvm install 0.12
nvm use 0.12
nvm alias default 0.12
```

Make sure you have Ethereum installed (using `geth 1.3.x`).

```bash
# OSX - Install with Homebrew
brew tap ethereum/ethereum
brew install ethereum
brew install cpp-ethereum # for solidity

# Ubuntu - Install with apt
sudo apt-get install software-properties-common
sudo add-apt-repository -y ppa:ethereum/ethereum
sudo add-apt-repository -y ppa:ethereum/ethereum-dev
sudo apt-get update
sudo apt-get install ethereum
sudo apt-get install cpp-ethereum # for solidity
```

Look at the README.md file in each example folder for further example-specific installation steps.
