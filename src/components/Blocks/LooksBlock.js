// src/components/blocks/LooksBlocks.js
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

const LooksBlocks = () => {
	const dispatch = useDispatch();
	const activeSpriteId = useSelector(state => state.sprites.activeSprite);

	const handleDragStart = (e, blockType) => {
		e.dataTransfer.setData('blockType', blockType);
		e.dataTransfer.setData('spriteId', activeSpriteId);
	};

	return (
		<div className='p-4 bg-gray-100 rounded-lg'>
			<h3 className='font-bold mb-2'>Looks</h3>
			<div className='space-y-2'>
				<div
					draggable
					onDragStart={e => handleDragStart(e, 'sayForSeconds')}
					className='p-2 bg-purple-500 text-white rounded cursor-move'>
					say [Hello!] for [2] seconds
				</div>
				<div
					draggable
					onDragStart={e => handleDragStart(e, 'thinkForSeconds')}
					className='p-2 bg-purple-500 text-white rounded cursor-move'>
					think [Hmm...] for [2] seconds
				</div>
			</div>
		</div>
	);
};

export default LooksBlocks;
