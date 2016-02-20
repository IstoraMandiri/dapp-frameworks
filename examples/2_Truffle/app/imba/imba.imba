window:onload = do ($$(#app)).append <app>

tag app

  prop account
  prop balance
  prop status

  def build
    load
    schedule

  def load
    global:web3:eth:getAccounts do |err,accounts|
      if err
        alert "There was an error fetching your accounts."
        return null
      unless accounts[0]
        alert "Couldn't get any accounts! Make sure your Ethereum client is configured correctly."
        return null

      account = accounts[0]
      refreshBalance

  def refreshBalance
    MetaCoin.deployed:getBalance:call(account, {from: account})
    .then do |value|
      balance = value.valueOf
    .catch do |e|
      status = "Error getting balance; see log."
      console.log e

  def onsubmit e
    e.cancel.halt
    status = "Initiating transaction... (please wait)"
    MetaCoin.deployed:sendCoin(@receiver.value, @amount.value, {from: account})
    .then do
      @amount.value = ''
      @receiver.value = ''
      status = "Transaction complete!"
      refreshBalance
    .catch do |e|
      status = "Error sending coin; see log."
      console.log e


  def render
    <self>
      if balance
        <h3>
          'You have '
          <span .black>
            balance
            ' META'
      <h1> 'Send'
      <form>
        <label> 'Amount:'
        <input@amount type='text' placeholder='e.g., 95'>
        <br>
        <label> 'To Address:'
        <input@receiver type='text' placeholder='e.g., 0x93e66d9baea28c17d9fc393b53e3fbdd76899dae'>
        <br>
        <br>
        <button type='submit'> 'Send MetaCoin'
        <br>
        <br>
      <span> status