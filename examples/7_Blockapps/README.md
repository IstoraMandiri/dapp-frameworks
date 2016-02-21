# BlockApps Example

## Installation

Use `node 5`

```
nvm use 5
# make sure bower is installed
npm install -g bower
```

Clone to blockapps repo and install globally.

```
npm install blockapps-bloc -g
```

## Try demo app

This example is already built so can be started simply by using:

```
bloc start
```

It also contains test file keys for your testing pleasure - but no guaruntees they'll work forever :)

## Create a new app

Initialise a new app

```
bloc init
```

Then enter your details. You can use 'test' for all mandatory fields.

Once you're done, install deps.

```
cd your_new_app
npm install
```

Generate an address and get funded.

```
# register the app
bloc register
# get your key + ether
bloc genkey
```

Now compile. `-s` adds scaffolding (but seems to be broken).

```
bloc compile
```


