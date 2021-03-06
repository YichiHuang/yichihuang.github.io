(function() {
	// Get some required handles
	var video = document.getElementById('v');
	var recStatus = document.getElementById('recStatus');
	var startRecBtn = document.getElementById('startRecBtn');
	var stopRecBtn = document.getElementById('stopRecBtn');

	// Define a new speech recognition instance,创建语音识别对象用于调用语音识别API
	var rec = null;
	try {
		rec = new webkitSpeechRecognition();
	} 
	catch(e) {
    	document.querySelector('.msg').setAttribute('data-state', 'show');
    	startRecBtn.setAttribute('disabled', 'true');
    	stopRecBtn.setAttribute('disabled', 'true');
    }
    if (rec) {
		rec.continuous = true;//保证语音识别器正在监听，否则默认是false
		rec.interimResults = false;
		rec.lang = 'en';

		// Define a threshold above which we are confident(!) that the recognition results are worth looking at 
		var confidenceThreshold = 0.5;

		// Simple function that checks existence of s in str，检查str中是否存在s
		var userSaid = function(str, s) {
			return str.indexOf(s) > -1;
		}

		// Highlights the relevant command that was recognised in the command list for display purposes
		var highlightCommand = function(cmd) {
			var el = document.getElementById(cmd); 
			el.setAttribute('data-state', 'highlight');
			setTimeout(function() {
				el.setAttribute('data-state', '');
			}, 3000);
		}

		// Process the results when they are returned from the recogniser
		rec.onresult = function(e) {
			// Check each result starting from the last one
			for (var i = e.resultIndex; i < e.results.length; ++i) {
				// If this is a final result
	       		if (e.results[i].isFinal) {
	       			// If the result is equal to or greater than the required threshold
	       			if (parseFloat(e.results[i][0].confidence) >= parseFloat(confidenceThreshold)) {
		       			var str = e.results[i][0].transcript;
		       			console.log('Recognised: ' + str);
		       			// If the user said 'video' then parse it further
		       			if (userSaid(str, 'video')) {
		       				// Replay the video
		       				if (userSaid(str, 'replay')) {
		       					video.currentTime = 0;
		       					video.play();
		       					highlightCommand('vidReplay');
		       				}
		       				// Play the video
		       				else if (userSaid(str, 'play')) {
		       					video.play();
		       					highlightCommand('vidPlay');
		       				}
		       				// Stop the video
		       				else if (userSaid(str, 'stop')) {
		       					video.pause();
		       					highlightCommand('vidStop');
		       				}
		       				// If the user said 'volume' then parse it even further
		       				else if (userSaid(str, 'volume')) {
		       					// Check the current volume setting of the video
		       					var vol = Math.floor(video.volume * 10) / 10;
		       					// Increase the volume
		       					if (userSaid(str, 'increase')) {
		       						if (vol >= 0.9) video.volume = 1;
		       						else video.volume += 0.1;
		       						highlightCommand('vidVolInc');
		       					}
		       					// Decrease the volume
		       					else if (userSaid(str, 'decrease')) {
		       						if (vol 