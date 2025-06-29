// src/hooks/useDragAndDrop.js
import { useDispatch, useSelector } from 'react-redux';

export const useDragAndDrop = () => {
	const dispatch = useDispatch();
	const activeSpriteId = useSelector(state => state.sprites.activeSprite);

	const handleDragStart = (e, blockType) => {
		e.dataTransfer.setData('blockType', blockType);
		e.dataTransfer.setData('spriteId', activeSpriteId);
	};

	const handleDrop = (e, callback) => {
		e.preventDefault();
		const blockType = e.dataTransfer.getData('blockType');
		const spriteId = e.dataTransfer.getData('spriteId');

		if (blockType && spriteId && callback) {
			callback({ blockType, spriteId });
		}
	};

	const handleDragOver = e => {
		e.preventDefault();
	};

	return { handleDragStart, handleDrop, handleDragOver };
};
