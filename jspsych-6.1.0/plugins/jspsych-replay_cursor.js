jsPsych.plugins["replay_cursor"] = (function() {

	var plugin = {};

	plugin.info = {
		name: 'replay_cursor',
		parameters: {

			duration: {
				type: jsPsych.plugins.parameterType.FLOAT,
				pretty_name: "duration",
				default: 2000,
				description: "Duration in milliseconds"
			},
			cursor_log: {
				type: jsPsych.plugins.parameterType.OBJECT
			}
		}
	}

	plugin.trial = function(display_element, trial) {

		cursor_log = trial.cursor_log;
		display_element.innerHTML = ''
		//open a p5 sketch
		let sketch = function(p) {

		//sketch setup
		p.setup = function() {
			p.createCanvas(p.windowWidth, p.windowHeight);
			p.background(128); //gray
			p.strokeWeight(0);
			p.frameRate(trial.frame_rate);
			p.noCursor();
		};



		//organize everything in one sequence
		p.draw = function() {

			millis = p.millis();
			// First, draw fixation cross
			if (millis<cursor_log.t.at(-1)) {

				// find frame number (there's probably a more efficient way to do this!)
				i = 0
				while (cursor_log.t[i]<millis) {
					i++
				}

				p.background(128);
				x = cursor_log.x[i];
				y = cursor_log.y[i];
				p.circle(x,y,50)
				
			} else { //trial ended
					p.remove()
					// data saving
					var trial_data = {
						cursor_log: cursor_log
					};

					// end trial
					jsPsych.finishTrial(trial_data);
				}
			}


		};

		// start sketch!
		let myp5 = new p5(sketch);

}

//Return the plugin object which contains the trial
return plugin;
})();
