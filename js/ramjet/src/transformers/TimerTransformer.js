import getTransform from '../utils/getTransform';
import getBorderRadius from '../utils/getBorderRadius';
import { linear } from '../easing';
import rAF from '../utils/rAF';

export default class TimerTransformer {
	constructor ( from, to, options ) {
		const dx = to.cx - from.cx;
		const dy = to.cy - from.cy;

		const dsxf = ( to.width / from.width ) - 1;
		const dsyf = ( to.height / from.height ) - 1;

		const dsxt = ( from.width / to.width ) - 1;
		const dsyt = ( from.height / to.height ) - 1;

		const startTime = Date.now();
		const duration = options.duration || 400;
		const easing = options.easing || linear;

		function tick () {
			const timeNow = Date.now();
			const elapsed = timeNow - startTime;

			if ( elapsed > duration ) {
				from.clone.parentNode.removeChild( from.clone );
				to.clone.parentNode.removeChild( to.clone );

				if ( options.done ) {
					options.done();
				}

				return;
			}

			const t = easing( elapsed / duration );

			// opacity
			from.clone.style.opacity = 1 - t;
			to.clone.style.opacity = t;

			// border radius
			const borderRadius = getBorderRadius( from.borderRadius, to.borderRadius, t );
			from.clone.style.borderTopLeftRadius = to.clone.style.borderTopLeftRadius = borderRadius[0];
			from.clone.style.borderTopRightRadius = to.clone.style.borderTopRightRadius = borderRadius[1];
			from.clone.style.borderBottomRightRadius = to.clone.style.borderBottomRightRadius = borderRadius[2];
			from.clone.style.borderBottomLeftRadius = to.clone.style.borderBottomLeftRadius = borderRadius[3];

			const cx = from.cx + ( dx * t );
			const cy = from.cy + ( dy * t );

			const fromTransform = getTransform( from.isSvg, cx, cy, dx, dy, dsxf, dsyf, t ) + ' ' + from.transform;
			const toTransform = getTransform( to.isSvg, cx, cy, -dx, -dy, dsxt, dsyt, 1 - t ) + ' ' + to.transform;

			if ( from.isSvg ) {
				from.clone.setAttribute( 'transform', fromTransform );
			} else {
				from.clone.style.transform = from.clone.style.webkitTransform = from.clone.style.msTransform = fromTransform;
			}

			if ( to.isSvg ) {
				to.clone.setAttribute( 'transform', toTransform );
			} else {
				to.clone.style.transform = to.clone.style.webkitTransform = to.clone.style.msTransform = toTransform;
			}

			rAF( tick );
		}

		tick();
	}
}