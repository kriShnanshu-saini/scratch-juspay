import React, { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addSprite } from '../store/spriteSlice';

const FloatingSpriteSelector = () => {
	const dispatch = useDispatch();
	const availableSprites = useSelector(state => state.sprites.availableSprites);

	const [isHovered, setIsHovered] = useState(false);
	const hideTimer = useRef(null);

	const handleAddSprite = spriteType => {
		dispatch(addSprite({ spriteType }));
		setIsHovered(false);
	};

	const handleMouseEnter = () => {
		clearTimeout(hideTimer.current);
		setIsHovered(true);
	};

	const handleMouseLeave = () => {
		hideTimer.current = setTimeout(() => {
			setIsHovered(false);
		}, 1500); // 1.5 second delay before hiding
	};

	return (
		<div
			className='fixed bottom-4 right-4 z-50'
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}>
			{/* Floating circular button */}
			<div className='w-14 h-14 bg-green-500 hover:bg-green-600 text-white flex items-center justify-center rounded-full shadow-lg cursor-pointer transition duration-300'>
				<svg
					xmlns='http://www.w3.org/2000/svg'
					viewBox='0 0 24 24'
					fill='currentColor'
					className='w-6 h-6'>
					<path d='M12 4v16m8-8H4' />
				</svg>
			</div>

			{/* Sprite selection menu */}
			{isHovered && (
				<div className='absolute bottom-16 right-0 mb-2 w-52 bg-white rounded-md shadow-lg border border-gray-200 overflow-hidden'>
					{availableSprites.map(sprite => (
						<div
							key={sprite.id}
							onClick={() => handleAddSprite(sprite.id)}
							className='flex items-center p-2 hover:bg-gray-100 cursor-pointer'>
							<div className='w-8 h-8 mr-2 rounded-full bg-gray-100 overflow-hidden'>
								<img
									src={`/sprites/${sprite.image}`}
									alt={sprite.name}
									className='w-full h-full object-cover'
								/>
							</div>
							<span className='text-sm'>{sprite.name}</span>
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export default FloatingSpriteSelector;
