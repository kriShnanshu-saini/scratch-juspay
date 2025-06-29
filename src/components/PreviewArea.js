import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { runAllScripts, toggleHeroMode, renameSprite, removeSprite, setActiveSprite } from '../store/spriteSlice';
import FloatingAddSpriteButton from './FloatingAddSpriteButton';
import SpriteInfoPanel from './SpriteInfoPanel';
import Stage from './Stage';

const PreviewArea = () => {
	const dispatch = useDispatch();
	const activeSprites = useSelector(state => state.sprites.activeSprites);
	const isRunning = useSelector(state => state.sprites.isRunning);
	const isHeroModeEnabled = useSelector(state => state.sprites.isHeroModeEnabled);
	const availableSprites = useSelector(state => state.sprites.availableSprites);
	const selectedSpriteId = useSelector(state => state.sprites.activeSprite);
	const selectedSprite = useSelector(state => state.sprites.activeSprites.find(sprite => sprite.id === selectedSpriteId));
	const stageSize = useSelector(state => state.sprites.stageSize);

	// select the first sprite if none is selected
	useEffect(() => {
		if (!selectedSpriteId && activeSprites.length > 0) {
			dispatch(setActiveSprite(activeSprites[0].id));
		}
	}, [activeSprites, selectedSpriteId, dispatch]);

	const handlePlay = () => {
		dispatch(runAllScripts());
	};

	const getSpriteImage = spriteType => {
		const sprite = availableSprites.find(s => s.id === spriteType);
		return sprite ? `sprites/${sprite.image}` : '';
	};

	const handleRename = (id, newName) => {
		dispatch(renameSprite({ id, newName }));
	};

	const handleDelete = id => {
		dispatch(removeSprite(id));
	};

	return (
		<div className='flex-1 border border-gray-300 p-4 flex flex-col'>
			{/* Header */}
			<div className='flex justify-between items-center mb-4'>
				<h2 className='text-lg font-bold'>Stage</h2>
				<div className='flex gap-2'>
					<button
						onClick={handlePlay}
						disabled={isRunning}
						className={`px-4 py-2 rounded ${isRunning ? 'bg-gray-500' : 'bg-green-500'} text-white`}>
						{isRunning ? 'Running...' : 'Play'}
					</button>
					<button
						onClick={() => dispatch(toggleHeroMode())}
						className={`px-4 py-2 rounded-md font-bold ${isHeroModeEnabled ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-800'}`}>
						Hero Mode: {isHeroModeEnabled ? 'ON' : 'OFF'}
					</button>
				</div>
			</div>

			{/* Stage area */}
			<div
				className='flex-1 bg-blue-50 border rounded mb-4 overflow-hidden'
				style={{
					width: stageSize.width ? `${stageSize.width}px` : '100%',
					height: stageSize.height ? `${stageSize.height}px` : '100%',
					minWidth: '400px', // Add minimum dimensions
					minHeight: '300px',
				}}>
				<Stage />
			</div>

			{/* SpriteInfoPanel - appears below stage when sprite is selected */}
			{selectedSprite && <SpriteInfoPanel />}

			{/* Sprite List */}
			<div className='flex items-center flex-wrap gap-4'>
				{activeSprites.map(sprite => (
					<div
						key={sprite.id}
						onClick={() => dispatch(setActiveSprite(sprite.id))}
						className={`relative flex flex-col items-center border rounded p-2 bg-white shadow-sm w-24 cursor-pointer ${selectedSpriteId === sprite.id ? 'ring-2 ring-purple-500' : ''}`}>
						<img
							src={getSpriteImage(sprite.type)}
							alt={sprite.name}
							className='w-16 h-16 object-contain mb-1'
						/>
						<input
							className='text-xs text-center border rounded px-1 py-0.5 w-full'
							value={sprite.name}
							onChange={e => handleRename(sprite.id, e.target.value)}
						/>
						<button
							onClick={e => {
								e.stopPropagation();
								handleDelete(sprite.id);
							}}
							className='absolute top-1 right-1 text-red-500 hover:text-red-700 text-sm'>
							×
						</button>
					</div>
				))}

				{/* Add Sprite Button */}
				<div className='flex items-center justify-center w-24 h-24'>
					<FloatingAddSpriteButton />
				</div>
			</div>
		</div>
	);
};

export default PreviewArea;
