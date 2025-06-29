import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { goToXY, renameSprite, resizeSprite, rotatesprite, toggleVisibility } from '../store/spriteSlice';

const SpriteInfoPanel = () => {
	const dispatch = useDispatch();
	const selected = useSelector(state => state.sprites.activeSprite);
	const sprite = useSelector(state => state.sprites.activeSprites.find(s => s.id === selected));
	const [newName, setNewName] = useState(sprite.name);
	const [newSize, setNewSize] = useState(sprite.size.toString());
	const [newRotation, setNewRotation] = useState(sprite.rotation.toString());

	const nameInputRef = useRef(null);
	const sizeInputRef = useRef(null);
	const rotationInputRef = useRef(null);

	useEffect(() => {
		setNewName(sprite.name); // reset if sprite changes
		setNewSize(sprite.size.toString());
		setNewRotation(sprite.rotation.toString());

	}, [sprite.name, sprite.size, sprite.rotation]);

	const updateXY = (axis, value) => {
		if (!sprite) return;
		const newValue = Number(value) || 0;
		dispatch(goToXY({ spriteId: sprite.id, x: axis === 'x' ? newValue : sprite.x, y: axis === 'y' ? newValue : sprite.y }));
	};

	const handleRename = e => {
		const name = newName.trim();
		if (name) {
			dispatch(renameSprite({ id: sprite.id, newName: name }));
		} else {
			setNewName(sprite.name);
		}
	};

	const handleVisibilityToggle = () => {
		dispatch(toggleVisibility(sprite.id));
	};

	const handleResizing = e => {
		const size = parseInt(newSize);
		if (!isNaN(size) && size > 0) {
			dispatch(resizeSprite({ spriteId: sprite.id, newSize: size }));
		} else {
			setNewSize(sprite.size.toString());
		}
		sizeInputRef.current?.blur();
	};

	const handleRotation = e => {
		const rot = parseInt(newRotation);
		if (!isNaN(rot)) {
			dispatch(rotatesprite({ spriteId: sprite.id, rotation: rot }));
		} else {
			setNewRotation(sprite.rotation.toString());
		}
		rotationInputRef.current?.blur();
	};

	if (!sprite) return null;

	return (
		<div className='p-4 bg-white rounded-lg shadow-md w-full max-w-4xl mx-auto mb-4'>
			<div className='flex flex-wrap items-center gap-4'>
				<div className='flex-1'>
					<label className='block text-sm font-medium'>Sprite</label>
					<input
						ref={nameInputRef}
						type='text'
						value={newName}
						onChange={e => setNewName(e.target.value)}
						onBlur={handleRename}
						onKeyDown={e => {
							if (e.key === 'Enter') {
								handleRename();
								nameInputRef.current?.blur();
							}
						}}
						className='mt-1 w-full border px-2 py-1 rounded'
					/>
				</div>
				<div>
					<label className='block text-sm font-medium'>x</label>
					<input
						type='number'
						value={Math.round(sprite.x)}
						onChange={e => updateXY('x', e.target.value)}
						className='mt-1 w-20 border px-2 py-1 rounded'
					/>
				</div>
				<div>
					<label className='block text-sm font-medium'>y</label>
					<input
						type='number'
						value={Math.round(sprite.y)}
						onChange={e => updateXY('y', e.target.value)}
						className='mt-1 w-20 border px-2 py-1 rounded'
					/>
				</div>
				<div>
					<label className='block text-sm font-medium'>Size</label>
					<input
						ref={sizeInputRef}
						type='number'
						value={newSize}
						onChange={e => setNewSize(e.target.value)}
						onBlur={handleResizing}
						onKeyDown={e => {
							if (e.key === 'Enter') handleResizing();
						}}
						className='mt-1 w-20 border px-2 py-1 rounded'
					/>
				</div>
				<div>
					<label className='block text-sm font-medium'>Direction</label>
					<input
						type='number'
						ref={rotationInputRef}
						value={newRotation}
						onChange={e => setNewRotation(e.target.value)}
						onBlur={handleRotation}
						onKeyDown={e => {
							if (e.key === 'Enter') handleRotation();
						}}
						className='mt-1 w-24 border px-2 py-1 rounded'
					/>
				</div>
				<div>
					<label className='block text-sm font-medium'>Visible</label>
					<input
						type='checkbox'
						checked={sprite.visible}
						onChange={handleVisibilityToggle}
						className='mt-2'
					/>
				</div>
			</div>
		</div>
	);
};

export default SpriteInfoPanel;
