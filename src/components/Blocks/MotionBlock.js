import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

const MotionBlocks = () => {
	const dispatch = useDispatch();
	const activeSpriteId = useSelector(state => state.sprites.activeSprite);

	const handleDragStart = (e, blockType) => {
		e.dataTransfer.setData('blockType', blockType);
		e.dataTransfer.setData('spriteId', activeSpriteId);
	};

	return (
		<div className='p-4 bg-gray-100 rounded-lg'>
			<h3 className='font-bold mb-2'>Motion</h3>
			<div className='space-y-2'>
				<div
					draggable
					onDragStart={e => handleDragStart(e, 'moveXsteps')}
					className='p-2 bg-blue-500 text-white rounded cursor-move'>
					move X [10] steps
				</div>
				<div
					draggable
					onDragStart={e => handleDragStart(e, 'moveYsteps')}
					className='p-2 bg-blue-500 text-white rounded cursor-move'>
					move Y [10] steps
				</div>
				<div
					draggable
					onDragStart={e => handleDragStart(e, 'turnDegrees')}
					className='p-2 bg-blue-500 text-white rounded cursor-move'>
					turn [15] degrees
				</div>
				<div
					draggable
					onDragStart={e => handleDragStart(e, 'goToXY')}
					className='p-2 bg-blue-500 text-white rounded cursor-move'>
					go to x: [0] y: [0]
				</div>
			</div>
		</div>
	);
};

export default MotionBlocks;
