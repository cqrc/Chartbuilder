// Svg text elements used to describe chart
var React = require("react");
var PropTypes = React.PropTypes;
var ChartViewActions = require("../../actions/ChartViewActions");
var markdown = require("markdown").markdown;

var config = {
	textDy: 0.7,
	textLineHeight: 1.2
};

/**
 * An Svg <text> element with experimental text wrapping support
 * @instance
 * @memberof RendererWrapper
 */
var SvgText = React.createClass({

	propTypes: {
		className: PropTypes.string,
		heightPerLine: PropTypes.number,
		onUpdate: PropTypes.func,
		translate: PropTypes.array.isRequired,
		text: PropTypes.string.isRequired,
		wrap: PropTypes.bool,
		maxCharacters: PropTypes.number
	},

	shouldComponentUpdate: function(nextProps, nextState) {
		if ((nextState.lines.length !== this.state.lines.length) && nextProps.onUpdate && nextProps.wrap) {
			if (nextState.lines.length === 1) {
				this.props.onUpdate(0);
			} else {
				this.props.onUpdate((nextState.lines.length) * this.props.heightPerLine);
			}
			return false;
		}
		if (nextProps.text !== this.props.text) {
			return true;
		}
		var t1 = this.props.translate;
		var t2 = nextProps.translate;
		var newTrans = ( (t1[0] !== t2[0]) || (t1[1] !== t2[1]) );
		if (newTrans) {
			return true;
		}
		if (this.props.maxWidth !== nextProps.maxWidth) {
			return true;
		}

		return true;
	},

	getDefaultProps: function() {
		return {
			wrap: false,
			maxCharacters: 100
		};
	},

	getInitialState: function() {
		return {
			lines: [ this.props.text ]
		};
	},

	_wrapLines: function(props) {
		var lines = [];

		if (props.wrap) {
			maxCharacters = props.maxCharacters;
			var newWords = props.text.split(" ");
			var words = [];
			var spanLength = 0;
			var cont_bold = false;
			var cont_ital = false;

			newWords.forEach(function(word) {
				if (spanLength + word.length > maxCharacters) {
					lines.push(words.join(" "));
					words.length = 0;
					spanLength = 0;
				}
				spanLength += word.length;
				words.push(word);
			});

			if (words.length) {
				var line = words.join(" ");

				//make sure we don't break markdown styling by splitting a line
				//this will break if _**italic bold**_ is used but not if **_bold italic_** is used

				if(cont_bold) {
					//start with a bold token if a bold token had to be added to the end previous line
					line = "**" + line;
					cont_bold = false;
				}

				if(cont_ital) {
					//start with a italic token if a italic token had to be added to the end previous line
					line = "_" + line;
					cont_ital = false;
				}

				if(line.split("**").length % 2 == 0 && props.text.split("**").length % 2 != 0) {
					//end with a bold token if the line left an odd number of them
					line += "**";
					cont_bold = true;
				}

				if(line.split("_").length % 2 == 0 && props.text.split("_").length % 2 != 0) {
					//end with a italic token if the line left an odd number of them
					line += "_";
					cont_ital = true;
				}

				lines.push(line);
			}
		} else {
			lines = [props.text];
		}

		return {
			lines: lines
		};
	},

	componentWillMount: function() {
		if (this.props.text && this.props.wrap) {
			var lineSettings = this._wrapLines(this.props, this.state);
			this.setState(lineSettings);
		}
	},

	componentDidMount: function() {
		if (this.props.onUpdate && this.props.wrap) {
			if (this.state.lines.length === 1) {
				this.props.onUpdate(0);
			} else {
				this.props.onUpdate((this.state.lines.length) * this.props.heightPerLine);
			}
		}
	},

	componentWillReceiveProps: function(nextProps) {
		if (this.props.wrap) {
			var lineSettings = this._wrapLines(nextProps);
			this.setState(lineSettings);
		}
	},

	_markdownToTspans: function(input,that,index) {
		if (!input) return null;

		var type = input.shift();

		return input.map(function(item,i) {
			var fill;
			if (typeof item == "string") {
				fill = "​" + item // add a zero width space to the beginging of the string

			}
			else {
				fill = that._markdownToTspans(item,that,index+1)[0]
			}

			return <tspan
					className = {type}
					key={Math.random() + "." + index}
				>
					{fill}
				</tspan>
		});
	},

	render: function() {
		var textNodes;
		var parsed_text;
		var mdToSpans = this._markdownToTspans;
		var that = this;
		if (this.props.wrap) {
			textNodes = this.state.lines.map(function(text, i) {
				parsed_text = markdown.parse(text)[1];
				return (
					<text
						dy={(i * config.textLineHeight).toString() + "em"}
						y="0"
						x="0"
						key={i}
					>
						{mdToSpans(parsed_text,that,0)}
					</text>
				);
			});
		} else {
			var dy;
			parsed_text = markdown.parse(this.props.text)[1]
			if (this.props.align === "bottom") {
				dy = "-0.35em";
			} else if (this.props.align === "top"){
				dy = "0.35em";
			} else {
				dy = "0em";
			}

			textNodes = (
				<text
					y="0"
					x="0"
					dy={dy}
				>
					{mdToSpans(parsed_text,that,0)}
				</text>
			)
		}
		return (
			<g
				className={["svg-text", this.props.className].join(" ")}
				transform={"translate(" + this.props.translate + ")"}
			>
				{textNodes}
			</g>
		);
	}

});

module.exports = SvgText;
