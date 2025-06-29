import SpriteSelector from './SpriteSelector';
import React, { useState } from 'react';
import { useDrag } from 'react-dnd';
import { ItemTypes } from '../constants/dndTypes';

const Block = ({ type, initialValues }) => {
	// Use initialValues as the starting point, but maintain local state
	const [values, setValues] = useState(initialValues);

	const [{ isDragging }, drag] = useDrag({
		type: ItemTypes.BLOCK,
		item: () => ({
			type,
			values: { ...values }, // <- this captures fresh values
		}),
		collect: monitor => ({
			isDragging: !!monitor.isDragging(),
		}),
	});

	const handleChange = (key, value) => {
		const newValues = { ...values, [key]: value };
		setValues(newValues);
		// Update parent with new default values
		// onValueChange(type, newValues);
	};

	const renderInlineInput = () => {
		switch (type) {
			case 'moveXsteps':
				return (
					<span className='inline-flex items-center'>
						Move X{' '}
						<input
							type='number'
							value={values.steps}
							onChange={e => handleChange('steps', parseInt(e.target.value) || 0)}
							className='w-12 mx-1 px-1 py-0.5 rounded bg-blue-400 text-white border border-blue-300 text-center'
						/>{' '}
						steps
					</span>
				);
			case 'moveYsteps':
				return (
					<span className='inline-flex items-center'>
						Move Y{' '}
						<input
							type='number'
							value={values.steps}
							onChange={e => handleChange('steps', parseInt(e.target.value) || 0)}
							className='w-12 mx-1 px-1 py-0.5 rounded bg-blue-400 text-white border border-blue-300 text-center'
						/>{' '}
						steps
					</span>
				);
			case 'turnDegrees':
				return (
					<span className='inline-flex items-center'>
						Turn{' '}
						<input
							type='number'
							value={values.degrees}
							onChange={e => handleChange('degrees', parseInt(e.target.value) || 0)}
							className='w-12 mx-1 px-1 py-0.5 rounded bg-blue-400 text-white border border-blue-300 text-center'
						/>{' '}
						degrees
					</span>
				);
			case 'sayForSeconds':
				return (
					<span className='inline-flex flex-wrap items-center'>
						Say{' '}
						<input
							type='text'
							value={values.text}
							onChange={e => handleChange('text', e.target.value)}
							className='w-20 mx-1 px-1 py-0.5 rounded bg-purple-400 text-white border border-purple-300'
						/>{' '}
						for{' '}
						<input
							type='number'
							value={values.seconds}
							onChange={e => handleChange('seconds', parseInt(e.target.value) || 0)}
							className='w-12 mx-1 px-1 py-0.5 rounded bg-purple-400 text-white border border-purple-300 text-center'
						/>{' '}
						seconds
					</span>
				);
			case 'thinkForSeconds':
				return (
					<span className='inline-flex flex-wrap items-center'>
						Think{' '}
						<input
							type='text'
							value={values.text}
							onChange={e => handleChange('text', e.target.value)}
							className='w-20 mx-1 px-1 py-0.5 rounded bg-purple-400 text-white border border-purple-300'
						/>{' '}
						for{' '}
						<input
							type='number'
							value={values.seconds}
							onChange={e => handleChange('seconds', parseInt(e.target.value) || 0)}
							className='w-12 mx-1 px-1 py-0.5 rounded bg-purple-400 text-white border border-purple-300 text-center'
						/>{' '}
						seconds
					</span>
				);
			case 'goToXY':
				return 'Go to x:0 y:0';
			default:
				return '';
		}
	};

	return (
		<div
			ref={drag}
			className={`p-3 mb-2 rounded-lg cursor-move ${isDragging ? 'opacity-50' : 'opacity-100'} ${
				type.includes('move') ? 'bg-blue-500' : type.includes('turn') ? 'bg-blue-400' : type.includes('say') ? 'bg-purple-500' : 'bg-purple-400'
			} text-white`}>
			{renderInlineInput()}
		</div>
	);
};

const Sidebar = () => {
	const [blockValues, setBlockValues] = useState({
		moveSteps1: { steps: 10 },
		moveSteps2: { steps: 10 },
		turnDegrees1: { degrees: 15 },
		turnDegrees2: { degrees: 15 },
		sayForSeconds: { text: 'Hello!', seconds: 2 },
		thinkForSeconds: { text: 'Hmm...', seconds: 2 },
	});

	const handleValueChange = (blockType, newValues) => {
		setBlockValues(prev => ({
			...prev,
			[blockType]: newValues,
		}));
	};

	return (
		<div className='w-64 bg-gray-50 p-4 border-r border-gray-200'>
			<div className='mb-6'>
				<div className='flex justify-between items-center mb-4'>
					<h2 className='text-xl font-bold'>Sprites</h2>
					<SpriteSelector />
				</div>
			</div>

			{/* Motion Blocks */}
			<div className='mb-6'>
				<h3 className='font-semibold mb-2 text-blue-700'>Motion</h3>
				<Block
					type='moveXsteps'
					initialValues={{ steps: 10 }}
					key='moveX'
				/>
				<Block
					type='moveYsteps'
					initialValues={{ steps: 10 }}
					key='moveY'
				/>
				<Block
					type='turnDegrees'
					initialValues={{ degrees: 15 }}
					key='turn1'
				/>
				<Block
					type='turnDegrees'
					initialValues={{ degrees: 15 }}
					key='turn2'
				/>
			</div>

			{/* Looks Blocks */}
			<div>
				<h3 className='font-semibold mb-2 text-purple-700'>Looks</h3>
				<Block
					type='sayForSeconds'
					initialValues={{ text: 'Hello!', seconds: 2 }}
					key='say1'
				/>
				<Block
					type='thinkForSeconds'
					initialValues={{ text: 'Hmm...', seconds: 2 }}
					key='think1'
				/>
			</div>
		</div>
	);
};

export default Sidebar;
