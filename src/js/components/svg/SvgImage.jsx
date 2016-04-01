// Svg image elements used to annotate chart
var React = require("react");
var PropTypes = React.PropTypes;
var ChartViewActions = require("../../actions/ChartViewActions");

/**
 * An Svg <image> element with width and height
 * @instance
 * @memberof RendererWrapper
 */
var SvgImage = React.createClass({

	propTypes: {
		className: PropTypes.string,
		onUpdate: PropTypes.func,
		translate: PropTypes.array.isRequired,
		url: PropTypes.string.isRequired
	},

	render: function() {
		var imgNodes;
		
			imgNodes = (
				<svg dangerouslySetInnerHTML={{__html: "<image xlink:href='" + this.props.url +
				 "' width='" + this.props.width +
				 "' height='" + this.props.height +
				 "'/>" }} />
			)
		
		return (
			<g
				className={["svg-img", this.props.className].join(" ")}
				transform={"translate(" + this.props.translate + ")"}
			>
				{imgNodes}
			</g>
		);
	}

});

module.exports = SvgImage;