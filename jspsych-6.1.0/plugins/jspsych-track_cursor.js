jsPsych.plugins["track_cursor"] = (function() {

	var plugin = {};

	plugin.info = {
		name: 'track_cursor',
		parameters: {

			duration: {
				type: jsPsych.plugins.parameterType.FLOAT,
				pretty_name: "duration",
				default: 5000,
				description: "Duration in milliseconds"
			}
		}
	}

	plugin.trial = function(display_element, trial) {

		display_element.innerHTML = ''
		var cursor_log = {t:[], x:[], y: []};
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

		function presentFixationCross() {
			p.background(128);
			p.fill(255)
			p.rect(p.width/2-12, p.height/2-2, 24, 4);
			p.rect(p.width/2-2, p.height/2-12, 4, 24);
		}


		//organize everything in one sequence
		p.draw = function() {

			// First, draw fixation cross
			if (p.millis()<trial.duration) {
				p.background(128);
				x = p.mouseX;
				y = p.mouseY;
				p.circle(x,y,50)
				cursor_log.t.push(p.millis());
				cursor_log.x.push(x);
				cursor_log.y.push(y);
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
