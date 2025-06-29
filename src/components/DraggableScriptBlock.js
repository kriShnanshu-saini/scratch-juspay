import React, { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { ItemTypes } from '../constants/dndTypes';
import { useDispatch } from 'react-redux';
import { removeScriptFromSprite, reorderScripts } from '../store/spriteSlice';

const ScriptBlock = ({ script, index, spriteId }) => {
	const dispatch = useDispatch();
	const ref = useRef(null);

	// Drag logic
	const [{ isDragging }, drag] = useDrag({
		type: ItemTypes.SCRIPT,
		item: { id: script.id, index, spriteId },
		collect: monitor => ({
			isDragging: monitor.isDragging(),
		}),
	});

	// Drop logic
	const [, drop] = useDrop({
		accept: ItemTypes.SCRIPT,
		hover(draggedItem, monitor) {
			if (!ref.current) return;
			const dragIndex = draggedItem.index;
			const hoverIndex = index;

			if (dragIndex === hoverIndex || draggedItem.spriteId !== spriteId) return;

			// Dispatch reorder
			dispatch(reorderScripts({ spriteId, fromIndex: dragIndex, toIndex: hoverIndex }));

			// Update drag item's index
			draggedItem.index = hoverIndex;
		},
	});

	drag(drop(ref)); // Combine drag & drop on same element

	return (
		<div
			ref={ref}
			key={script.id}
			className={`script-block flex items-center justify-between p-2 rounded text-sm w-full 
                ${
					script.type.includes('move')
						? 'bg-blue-100 border border-blue-200'
						: script.type.includes('turn')
						? 'bg-blue-200 border border-blue-300'
						: script.type.includes('say')
						? 'bg-purple-100 border border-purple-200'
						: 'bg-purple-200 border border-purple-300'
				} 
                ${isDragging && 'opacity-50'}`}
			style={{
				cursor: isDragging ? '' : 'move',
				cursor: isDragging ? '-webkit-grabbing' : '-webkit-grab',
				cursor: isDragging ? '-moz-grabbing' : '-moz-grab',
				cursor: isDragging ? 'grabbing' : 'grab',
			}}>
			<div>
				{script.type === 'moveXsteps' && `Move X ${script.steps || 10} steps`}
				{script.type === 'moveYsteps' && `Move Y ${script.steps || 10} steps`}
				{script.type === 'turnDegrees' && `Turn ${script.degrees || 15}°`}
				{script.type === 'goToXY' && `Go to x:0 y:0`}
				{script.type === 'sayForSeconds' && `Say "${script.text || 'Hello!'}" for ${script.seconds || 2}s`}
				{script.type === 'thinkForSeconds' && `Think "${script.text || 'Hmm...'}" for ${script.seconds || 2}s`}
			</div>
			<button
				onClick={() => dispatch(removeScriptFromSprite({ spriteId, scriptId: script.id }))}
				className='ml-2 text-red-500 hover:text-red-700'>
				×
			</button>
		</div>
	);
};

export default ScriptBlock;
