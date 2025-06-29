import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useDrop } from 'react-dnd';
import { goToXY, setStageSize } from '../store/spriteSlice';
import StageSprite from './StageSprite';
import { ItemTypes } from '../constants/dndTypes';

const Stage = () => {
	const sprites = useSelector(state => state.sprites.activeSprites);
	const dispatch = useDispatch();
	const stageRef = useRef(null);

	useEffect(() => {
		if (stageRef.current) {
			const { width, height } = stageRef.current.getBoundingClientRect();
			dispatch(setStageSize({ width, height }));
		}
	}, []);

	const [, drop] = useDrop({
		accept: ItemTypes.SPRITE,
		drop: (item, monitor) => {
			const stageRect = stageRef.current.getBoundingClientRect();
			const clientOffset = monitor.getClientOffset();
			const x = clientOffset.x - stageRect.left - stageRect.width / 2;
			const y = clientOffset.y - stageRect.top - stageRect.height / 2;
			dispatch(goToXY({ spriteId: item.id, x, y }));
		},
	});

	return (
		<div
			ref={el => {
				stageRef.current = el;
				drop(el); // attach drop ref correctly
			}}
			className='relative overflow-hidden w-full h-full border'>
			{sprites
				.filter(sprite => sprite.visible !== false) // hide if explicitly false
				.map(sprite => (
					<StageSprite
						key={sprite.id}
						sprite={sprite}
					/>
				))}
		</div>
	);
};

export default Stage;
