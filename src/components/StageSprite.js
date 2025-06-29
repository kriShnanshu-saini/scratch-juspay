import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { goToXY, setActiveSprite } from '../store/spriteSlice';
import { useDrag } from 'react-dnd';
import { ItemTypes } from '../constants/dndTypes';
import gsap from 'gsap';

const StageSprite = ({ sprite }) => {
	const dispatch = useDispatch();
	const spriteRef = useRef(null);
	const dragMonitorRef = useRef(null);
	const [bubbleVisible, setBubbleVisible] = useState(false);
	const [bubbleDirection, setBubbleDirection] = useState('top');
	const bubbleRef = useRef(null);
	const [animatedText, setAnimatedText] = useState('');

	const [{ isDragging }, dragRef, previewRef] = useDrag(() => ({
		type: ItemTypes.SPRITE,
		item: () => {
			dispatch(setActiveSprite(sprite.id)); // set as selected while dragging
			return { id: sprite.id };
		},
		collect: monitor => {
			dragMonitorRef.current = monitor;
			return {
				isDragging: monitor.isDragging(),
			};
		},
	}));

	// updating the coordinates of sprite, while dragging
	useEffect(() => {
		if (!isDragging) return;

		const unsubscribe = dragMonitorRef.current?.subscribeToOffsetChange(() => {
			const offset = dragMonitorRef.current.getClientOffset();
			if (!offset || !spriteRef.current) return;

			const stage = spriteRef.current.offsetParent.getBoundingClientRect();
			const offsetX = offset.x - stage.left - stage.width / 2;
			const offsetY = offset.y - stage.top - stage.height / 2;

			dispatch(goToXY({ spriteId: sprite.id, x: offsetX, y: offsetY }));
		});

		return () => unsubscribe?.();
	}, [isDragging, dispatch, sprite.id]);

	// where the bubble should be placed
	useEffect(() => {
		if (!spriteRef.current) return;

		const stage = spriteRef.current.offsetParent.getBoundingClientRect();
		const spriteBox = spriteRef.current.getBoundingClientRect();

		const margin = 40; // min margin from edge to show bubble

		const spaceTop = spriteBox.top - stage.top;
		const spaceBottom = stage.bottom - spriteBox.bottom;
		const spaceLeft = spriteBox.left - stage.left;
		const spaceRight = stage.right - spriteBox.right;

		let direction = 'top'; //default

		if (spaceTop > margin) {
			direction = 'top';
		} else if (spaceBottom > margin) {
			direction = 'bottom';
		} else if (spaceRight > margin) {
			direction = 'right';
		} else if (spaceLeft > margin) {
			direction = 'left';
		}

		setBubbleDirection(direction);

		let timeout;
		let interval;
		let dotCount = 0;

		if (sprite.thinkText && !sprite.sayText) {
			setBubbleVisible(true);

			// gsap fades in
			gsap.fromTo(bubbleRef.current, { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 0.3, ease: 'power2.out' });

			// animate ... dots
			interval = setInterval(() => {
				dotCount = (dotCount + 1) % 4;
				setAnimatedText('.'.repeat(dotCount));
			}, 400);

			const duration = (sprite.thinkForSeconds || 2) * 1000;

			// Hide after duration
			timeout = setTimeout(() => {
				clearInterval(interval);

				gsap.to(bubbleRef.current, {
					opacity: 0,
					scale: 0.8,
					duration: 0.3,
					ease: 'power2.in',
					onComplete: () => setBubbleVisible(false),
				});
			}, duration);
		} else if (sprite.sayText) {
			setAnimatedText('');
			setBubbleVisible(true);

			// Fade in
			gsap.fromTo(bubbleRef.current, { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 0.3, ease: 'power2.out' });

			const duration = (sprite.sayForSeconds || 2) * 1000;

			timeout = setTimeout(() => {
				gsap.to(bubbleRef.current, {
					opacity: 0,
					scale: 0.8,
					duration: 0.3,
					ease: 'power2.in',
					onComplete: () => setBubbleVisible(false),
				});
			}, duration);
		} else {
			setBubbleVisible(false);
		}

		return () => {
			clearTimeout(timeout);
			clearInterval(interval);
		};
	}, [sprite.sayText, sprite.thinkText, sprite.x, sprite.y, sprite.thinkForSeconds, sprite.sayForSeconds]);

	const SpriteSvg = sprite.image;

	return (
		<div
			ref={node => {
				spriteRef.current = node;
				dragRef(node);
			}}
			className='absolute'
			data-sprite-id={sprite.id}
			style={{
				left: `calc(50% + ${sprite.x}px)`,
				top: `calc(50% + ${sprite.y}px)`,
				transform: `translate(-50%, -50%)`,
				opacity: isDragging ? 0 : 1,
				cursor: 'grab',
				pointerEvents: 'auto',
				width: `${sprite.size}px`,
				height: `${sprite.size}px`,
				transformOrigin: 'center center',
				width: 'fit-content',
				height: 'fit-content',
			}}>
			<img
				src={`sprites/${sprite.image}`}
				alt={sprite.name}
				className='object-cover object-center'
				draggable={false}
				style={{
					pointerEvents: 'none',
					width: `${sprite.size}px`,
					height: `${sprite.size}px`,
				}}
			/>
			{bubbleVisible && (
				<div
					ref={bubbleRef}
					className={`absolute text-sm bg-white text-black px-2 py-1 rounded shadow ${bubbleDirection === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'}`}>
					{/* {sprite.sayText || (sprite.thinkText && `${sprite.thinkText}${animatedText}`)} */}
					{sprite.sayText ||
						(sprite.thinkText && (
							<>
								{sprite.thinkText.replace(/\.*$/, '')}
								<span className='relative inline-block w-[1ch]'>
									{/* Animated dots */}
									<span className='absolute left-0 top-0'>{animatedText}</span>

									{/* Hidden full dots to reserve space */}
									<span className='invisible'>...</span>
								</span>
							</>
						))}
				</div>
			)}
		</div>
	);
};

export default StageSprite;
