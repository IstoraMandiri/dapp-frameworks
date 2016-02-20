# Embark Example

This demo shows the Embark Framework in action.

## Installation

Make sure you have `node 0.12.x`

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

Install `embark-framework` globally

```bash
# install grunt
npm install -g grunt
# isntall embark
npm install -g embark-framework
```

## Usage

First start a blockchain process

```bash
cd examples/embark
embark blockchain
```

In a new terminal window, start up the server.

```bash
cd examples/embark
embark run
```

If you use LiveReload, turn it on!

Then visit http://localhost:3000
