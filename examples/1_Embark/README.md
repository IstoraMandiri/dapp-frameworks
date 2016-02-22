# Embark Example

This demo shows the Embark Framework in action.

## Installation

Install `embark-framework` globally

```bash
# install grunt
npm install -g grunt
# isntall embark
npm install -g embark-framework
# npm install
cd examples/embark
npm install
```

## Usage

First start a blockchain process

```bash
embark blockchain
```

Test contracts

```bash
embark spec
```

In a new terminal window, start up the server.

```bash
embark run
```

If you use LiveReload, turn it on!

Then visit http://localhost:3000

---

Bonus Tip: Easy Test Blockchain

Create an empty embark installation

```
cd ~/
embark new embark-blockchain
mv embark-blockchain .embark-blockchain
cd .embark-blockchain
# Remove all .sol files, update contracts.yml
```

Then create an alias

```
geth-test(){
  nvm use 0.12;
  cd ~/.embark-blockchain;
  embark blockchain;
}
```
