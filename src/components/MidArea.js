import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useDrop } from 'react-dnd';
import { ItemTypes } from '../constants/dndTypes';
import { addScriptToSprite, removeScriptFromSprite } from '../store/spriteSlice';
import ScriptBlock from './DraggableScriptBlock';

// Define SpriteColumn component inside MidArea.js or import it if it's in a separate file
const SpriteColumn = ({ sprite }) => {
	const dispatch = useDispatch();

	const [{ isOver }, drop] = useDrop(() => ({
		accept: ItemTypes.BLOCK,
		drop: item => {
			dispatch(
				addScriptToSprite({
					spriteId: sprite.id,
					script: {
						type: item.type,
						...item.values, // Include the values from the dragged block
					},
				})
			);
		},
		collect: monitor => ({
			isOver: !!monitor.isOver(),
		}),
	}));

	return (
		<div
			ref={drop}
			className={`flex-1 p-4 rounded-lg min-w-[200px] ${isOver ? 'bg-blue-50 border-2 border-blue-300' : 'bg-gray-50 border border-gray-200'}`}>
			<h3 className='font-bold mb-3 text-center'>{sprite.name}</h3>
			<div className='space-y-2'>
				{/* {sprite.scripts?.map(script => (
					<div
						className={`flex items-center justify-between p-2 rounded text-sm w-full ${
							script.type.includes('move')
								? 'bg-blue-100 border border-blue-200'
								: script.type.includes('turn')
								? 'bg-blue-200 border border-blue-300'
								: script.type.includes('say')
								? 'bg-purple-100 border border-purple-200'
								: 'bg-purple-200 border border-purple-300'
						}`}
						key={script.id}>
						<div
							key={script.id}
							className=''>
							{script.type === 'moveSteps' && `Move ${script.steps || 10} steps`}
							{script.type === 'turnDegrees' && `Turn ${script.degrees || 15}°`}
							{script.type === 'goToXY' && `Go to x:0 y:0`}
							{script.type === 'sayForSeconds' && `Say "${script.text || 'Hello!'}" for ${script.seconds || 2}s`}
							{script.type === 'thinkForSeconds' && `Think "${script.text || 'Hmm...'}" for ${script.seconds || 2}s`}
						</div>
						<button
							onClick={() => dispatch(removeScriptFromSprite({ spriteId: sprite.id, scriptId: script.id }))}
							className='ml-2 text-red-500 hover:text-red-700'>
							×
						</button>
					</div>
				))} */}

				{sprite.scripts?.map((script, index) => (
					<div
						key={script.id}
						className='flex items-center justify-between'>
						<ScriptBlock
							script={script}
							index={index}
							spriteId={sprite.id}
						/>
						{/* <button
							onClick={() => dispatch(removeScriptFromSprite({ spriteId: sprite.id, scriptId: script.id }))}
							className='ml-2 text-red-500 hover:text-red-700'>
							×
						</button> */}
					</div>
				))}
			</div>
		</div>
	);
};

const MidArea = () => {
	const activeSprites = useSelector(state => state.sprites.activeSprites);

	return (
		<div className='flex-1 flex flex-col p-4 bg-white'>
			<h2 className='text-xl font-bold mb-4'>Scripts</h2>
			<div className='flex gap-4 flex-1 overflow-x-auto'>
				{activeSprites.map(sprite => (
					<SpriteColumn
						key={sprite.id}
						sprite={sprite}
					/>
				))}
			</div>
		</div>
	);
};

export default MidArea;
