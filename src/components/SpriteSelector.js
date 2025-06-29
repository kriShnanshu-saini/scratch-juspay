import React from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addSprite } from '../store/spriteSlice';

const SpriteSelector = () => {
	const dispatch = useDispatch();
	const availableSprites = useSelector(state => state.sprites.availableSprites);
	const [isOpen, setIsOpen] = useState(false);

	const handleAddSprite = spriteType => {
		dispatch(addSprite({ spriteType }));
		setIsOpen(false);
	};

	return (
		<div className='relative'>
			<button
				onClick={() => setIsOpen(!isOpen)}
				className='bg-green-500 text-white px-4 py-2 rounded-md flex items-center'>
				Add Sprite
				<span className='ml-2'>▼</span>
			</button>

			{isOpen && (
				<div className='absolute top-full left-0 mt-1 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200'>
					{availableSprites.map(sprite => (
						<div
							key={sprite.id}
							onClick={() => handleAddSprite(sprite.id)}
							className='p-2 hover:bg-gray-100 cursor-pointer flex items-center'>
							<div className='w-8 h-8 mr-2 rounded-2xl bg-gray-50'>
								<img
									src={`/sprites/${sprite.image}`}
									alt={sprite.name}
									className='w-full object-cover object-center h-full '
								/>
							</div>
							{sprite.name}
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export default SpriteSelector;
