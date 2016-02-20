class Message

	var id = 0

	prop author
	prop text
	prop created

	def initialize text, author='Anon'
		@id = id++
		@text = text
		@author = author
		@created = Date.new

	def id
		@id

tag message < li

	def render
		<self>
			<.date> object.created.toLocaleString()
			<.message>
				<span .name> object.author
				" - " + object.text

tag app

	prop messages

	def build
		messages.push Message.new 'I am a fake message.'
		messages.push Message.new 'Hello'
		messages.push Message.new 'Sup?', 'Bob?!!'
		schedule

	def onsubmit e
		e.cancel.halt
		messages.push Message.new @text.value, @name.value || undefined
		@text.value = ''

	def hallo e
		console.log e

	def reversed
		messages.sort do |a,b| b.created - a.created

	def render
		<self>
			<h1 :tap='hallo'> "An Imba Chat Room"
			<form>
				<input@name placeholder='Your Alias'>
				<input@text placeholder='Enter Message'>
				<button type='submit'> 'Submit'
			if messages:length > 0
				<ul.messages>
					for message in reversed
						<message[message]@{message.id}>

var app = <app messages=[]>
($$(#chatapp)).append app
