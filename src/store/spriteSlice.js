import { createSlice, current } from '@reduxjs/toolkit';
import { createAsyncThunk } from '@reduxjs/toolkit';
import gsap from 'gsap';

const initialState = {
	availableSprites: [
		{ id: 'cat', name: 'Cat', image: 'pixelated_cat.png' },
		{ id: 'dog', name: 'Dog', image: 'pixelated_dog.png' },
		{ id: 'penguin', name: 'Bird', image: 'pixelated_penguin.png' },
		{ id: 'rabbit', name: 'Rabbit', image: 'pixelated_rabbit.png' },
	],
	activeSprites: [
		{
			id: 'cat1',
			type: 'cat',
			name: 'Cat 1',
			x: 0,
			y: 0,
			rotation: 0,
			size: 80,
			scripts: [],
			visible: true,
			image: 'pixelated_cat.png',
			sayText: null,
			sayForSeconds: null,
			thinkText: null,
			thinkForSeconds: null,
			currentIndex: 0, // currently executing script index
			shouldSwapScriptsWith: null, // id of the sprite it collided with
			hasCollided: false,
			collisionCooldown: false,
		},
	],
	activeSprite: null, // to track the currently active sprite
	isHeroModeEnabled: false,
	isRunning: false,
	stageSize: { width: 0, height: 0 },
};

export const spriteSlice = createSlice({
	name: 'sprites',
	initialState,
	reducers: {
		setStageSize: (state, action) => {
			state.stageSize = action.payload;
		},
		addSprite: (state, action) => {
			const { spriteType } = action.payload;
			const baseSprite = state.availableSprites.find(s => s.id === spriteType);

			if (baseSprite) {
				const newId = `${spriteType}${state.activeSprites.length + 1}`;

				const padding = 5;
				const maxX = state.stageSize.width / 2 - padding;
				const maxY = state.stageSize.height / 2 - padding;
				const minX = -maxX;
				const minY = -maxY;

				state.activeSprites.push({
					id: newId,
					type: spriteType,
					name: `${baseSprite.name} ${state.activeSprites.filter(s => s.type === spriteType).length + 1}`,
					x: Math.random() * (maxX - minX) + minX,
					y: Math.random() * (maxY - minY) + minY,
					rotation: 0,
					size: 80,
					scripts: [],
					visible: true,
					image: baseSprite.image,
					sayText: null,
					sayForSeconds: null,
					thinkText: null,
					thinkForSeconds: null,
					currentIndex: 0,
					shouldSwapScriptsWith: null,
					hasCollided: false,
					collisionCooldown: false,
				});

				state.activeSprite = newId; // set the new sprite as active
			}
		},
		removeSprite: (state, action) => {
			const spriteId = action.payload;
			state.activeSprites = state.activeSprites.filter(sprite => sprite.id !== spriteId);
		},
		renameSprite: (state, action) => {
			const { id, newName } = action.payload;
			const sprite = state.activeSprites.find(s => s.id === id);
			if (sprite) {
				sprite.name = newName.trim();
			}
		},
		resizeSprite: (state, action) => {
			const { spriteId, newSize } = action.payload;
			const sprite = state.activeSprites.find(s => s.id === spriteId);
			if (sprite) {
				sprite.size = newSize;
			}
		},
		rotatesprite: (state, action) => {
			const { spriteId, rotation } = action.payload;
			const sprite = state.activeSprites.find(s => s.id === spriteId);
			if (sprite) {
				sprite.rotation = rotation;
			}
		},
		setActiveSprite: (state, action) => {
			state.activeSprite = action.payload;
		},
		toggleVisibility: (state, action) => {
			const sprite = state.activeSprites.find(s => s.id === action.payload);
			if (sprite) sprite.visible = !sprite.visible;
		},
		addScriptToSprite: (state, action) => {
			const { spriteId, script } = action.payload;
			const sprite = state.activeSprites.find(s => s.id === spriteId);
			if (sprite) {
				if (!sprite.scripts) sprite.scripts = [];
				console.log(`📝 [SPRITE:${spriteId}] Adding script:`, script);
				sprite.scripts.push({
					id: Date.now().toString(),
					type: script.type,
					// make sure all values are properly included
					steps: script.steps, // for moveSteps
					degrees: script.degrees, // for turnDegrees
					text: script.text, // for say/think
					seconds: script.seconds, // for say/think
				});
				console.log(`📝 [SPRITE:${spriteId}] Now has ${sprite.scripts.length} scripts total`);
			}
		},
		removeScriptFromSprite: (state, action) => {
			const { spriteId, scriptId } = action.payload;
			const sprite = state.activeSprites.find(s => s.id === spriteId);
			if (sprite) {
				const beforeCount = sprite.scripts.length;
				console.log(`🗑️ [SPRITE:${spriteId}] Removing script ${scriptId}`);
				sprite.scripts = sprite.scripts.filter(script => script.id !== scriptId);
				console.log(`🗑️ [SPRITE:${spriteId}] Scripts count: ${beforeCount} → ${sprite.scripts.length}`);
			}
		},
		reorderScripts: (state, action) => {
			const { spriteId, fromIndex, toIndex } = action.payload;
			const sprite = state.activeSprites.find(s => s.id === spriteId);

			if (sprite && sprite.scripts) {
				const updatedScripts = [...sprite.scripts];
				const [moved] = updatedScripts.splice(fromIndex, 1);
				updatedScripts.splice(toIndex, 0, moved);
				sprite.scripts = updatedScripts;
			}
		},
		moveXsteps: (state, action) => {
			const { spriteId, steps } = action.payload;
			const sprite = state.activeSprites.find(s => s.id === spriteId);
			if (sprite) {
				sprite.x += steps;
			}
		},
		moveYsteps: (state, action) => {
			const { spriteId, steps } = action.payload;
			const sprite = state.activeSprites.find(s => s.id === spriteId);
			if (sprite) {
				sprite.y += steps;
			}
		},
		turnDegrees: (state, action) => {
			const { spriteId, degrees } = action.payload;
			const sprite = state.activeSprites.find(s => s.id === spriteId);
			if (sprite) {
				sprite.rotation += degrees;
			}
		},
		goToXY: (state, action) => {
			const { spriteId, x, y } = action.payload;
			const sprite = state.activeSprites.find(s => s.id === spriteId);
			if (sprite) {
				sprite.x = x;
				sprite.y = y;
			}
		},
		runScripts: state => {
			state.isRunning = true;
			console.log('🚀 Starting script execution...');
			// Reset all collision-related states when starting
			state.activeSprites.forEach(sprite => {
				sprite.hasCollided = false;
				sprite.collisionCooldown = false;
				sprite.shouldSwapScriptsWith = null;
				sprite.currentIndex = 0; // Reset to start from beginning
			});
		},
		stopScripts: state => {
			state.isRunning = false;
		},
		sayForSeconds: (state, action) => {
			const { spriteId, text, seconds } = action.payload;
			const sprite = state.activeSprites.find(s => s.id === spriteId);
			if (sprite) {
				sprite.sayText = text;
				sprite.sayForSeconds = seconds;
				// We'll handle the timeout in the thunk
			}
		},
		thinkForSeconds: (state, action) => {
			const { spriteId, text, seconds } = action.payload;
			const sprite = state.activeSprites.find(s => s.id === spriteId);
			if (sprite) {
				sprite.thinkText = text;
				sprite.thinkForSeconds = seconds;
				// We'll handle the timeout in the thunk
			}
		},
		clearSayText: (state, action) => {
			const { spriteId } = action.payload;
			const sprite = state.activeSprites.find(s => s.id === spriteId);
			if (sprite) {
				sprite.sayText = null;
			}
		},
		clearThinkText: (state, action) => {
			const { spriteId } = action.payload;
			const sprite = state.activeSprites.find(s => s.id === spriteId);
			if (sprite) {
				sprite.thinkText = null;
			}
		},
		checkCollisions: state => {
			if (!state.isHeroModeEnabled) {
				console.log('🔍 [COLLISION] Hero mode disabled, skipping collision check');
				return;
			}

			const sprites = state.activeSprites.filter(s => s.visible); // Only check visible sprites
			console.log(`🔍 [COLLISION] Checking collisions for ${sprites.length} visible sprites`);

			for (let i = 0; i < sprites.length; i++) {
				for (let j = i + 1; j < sprites.length; j++) {
					const sprite1 = sprites[i];
					const sprite2 = sprites[j];

					console.log(`🔍 [COLLISION] Checking ${sprite1.id} vs ${sprite2.id}`);

					// Skip if either is in collision cooldown or already marked for swapping
					if (sprite1.collisionCooldown || sprite2.collisionCooldown) {
						console.log(`❄️ [COLLISION] Skipping - cooldown active (${sprite1.id}: ${sprite1.collisionCooldown}, ${sprite2.id}: ${sprite2.collisionCooldown})`);
						continue;
					}
					if (sprite1.hasCollided || sprite2.hasCollided) {
						console.log(`🚫 [COLLISION] Skipping - already collided (${sprite1.id}: ${sprite1.hasCollided}, ${sprite2.id}: ${sprite2.hasCollided})`);
						continue;
					}
					if (sprite1.shouldSwapScriptsWith || sprite2.shouldSwapScriptsWith) {
						console.log(`🔄 [COLLISION] Skipping - already marked for swap (${sprite1.id}: ${sprite1.shouldSwapScriptsWith}, ${sprite2.id}: ${sprite2.shouldSwapScriptsWith})`);
						continue;
					}

					const dx = sprite1.x - sprite2.x;
					const dy = sprite1.y - sprite2.y;
					const distance = Math.sqrt(dx * dx + dy * dy);

					// Calculate collision threshold based on sprite sizes
					const collisionThreshold = (sprite1.size + sprite2.size) / 4;

					console.log(`📏 [COLLISION] Distance between ${sprite1.id} and ${sprite2.id}: ${distance.toFixed(2)}, threshold: ${collisionThreshold}`);
					console.log(`📍 [COLLISION] Positions - ${sprite1.id}: (${sprite1.x}, ${sprite1.y}), ${sprite2.id}: (${sprite2.x}, ${sprite2.y})`);

					if (distance < collisionThreshold) {
						// Mark both sprites for swapping
						sprite1.shouldSwapScriptsWith = sprite2.id;
						sprite2.shouldSwapScriptsWith = sprite1.id;
						sprite1.hasCollided = true;
						sprite2.hasCollided = true;
						console.log(`� [COLLISION] COLLISION DETECTED: ${sprite1.id} ↔ ${sprite2.id} (distance: ${distance.toFixed(2)}, threshold: ${collisionThreshold})`);
						console.log(`🔄 [COLLISION] Both sprites marked for script swap`);
						return; // Exit early after first collision to prevent multiple simultaneous collisions
					}
				}
			}
			console.log(`✅ [COLLISION] No collisions detected this cycle`);
		},
		toggleHeroMode: state => {
			state.isHeroModeEnabled = !state.isHeroModeEnabled;
			console.log(`🦸‍♂️ [HERO MODE] ${state.isHeroModeEnabled ? 'ENABLED' : 'DISABLED'}`);
		},
		swapSpriteScripts: (state, action) => {
			const { sprite1Id, sprite2Id, currentIndex1, currentIndex2 } = action.payload;

			const s1 = state.activeSprites.find(s => s.id === sprite1Id);
			const s2 = state.activeSprites.find(s => s.id === sprite2Id);

			if (s1 && s2) {
				console.log(`🔄 [SWAP] SWAPPING SCRIPTS: ${sprite1Id} ↔ ${sprite2Id}`);
				console.log(`🔄 [SWAP] Before swap - ${s1.id}: ${s1.scripts.length} scripts (index: ${s1.currentIndex}), ${s2.id}: ${s2.scripts.length} scripts (index: ${s2.currentIndex})`);

				// Store original scripts (deep copy to prevent reference issues)
				const tempScripts = JSON.parse(JSON.stringify(s1.scripts));

				// Perform the swap
				s1.scripts = JSON.parse(JSON.stringify(s2.scripts));
				s2.scripts = tempScripts;

				// Reset both sprites to start from beginning of their new scripts
				s1.currentIndex = 0;
				s2.currentIndex = 0;

				console.log(`🔄 [SWAP] After swap - ${s1.id}: ${s1.scripts.length} scripts (index: ${s1.currentIndex}), ${s2.id}: ${s2.scripts.length} scripts (index: ${s2.currentIndex})`);

				// Clear collision flags
				s1.shouldSwapScriptsWith = null;
				s2.shouldSwapScriptsWith = null;
				s1.hasCollided = false;
				s2.hasCollided = false;

				// Set collision cooldown to prevent immediate re-collision
				s1.collisionCooldown = true;
				s2.collisionCooldown = true;

				console.log(`✅ [SWAP] Script swap completed: ${sprite1Id} ↔ ${sprite2Id} - both sprites will start fresh with new scripts`);
			}
		},
		clearCollisionCooldown: (state, action) => {
			const { spriteId } = action.payload;
			const sprite = state.activeSprites.find(s => s.id === spriteId);
			if (sprite) {
				sprite.collisionCooldown = false;
				sprite.hasCollided = false;
				sprite.shouldSwapScriptsWith = null;
				console.log(`🔓 Collision cooldown cleared for ${spriteId}`);
			}
		},
		setCurrentIndex: (state, action) => {
			const { spriteId, index } = action.payload;
			const sprite = state.activeSprites.find(s => s.id === spriteId);
			if (sprite) {
				sprite.currentIndex = index;
			}
		},
	},
});

export const runAllScripts = createAsyncThunk('sprites/runAllScripts', async (_, { getState, dispatch }) => {
	console.log('🎬 [SCRIPT EXECUTION] Starting runAllScripts...');
	dispatch(spriteSlice.actions.runScripts());

	const { activeSprites, isHeroModeEnabled } = getState().sprites;
	console.log(`📊 [SCRIPT EXECUTION] Found ${activeSprites.length} sprites, Hero Mode: ${isHeroModeEnabled ? 'ON' : 'OFF'}`);

	// Create a global collision state to prevent multiple collisions
	let globalCollisionCooldown = false;
	// Track sprites that need to restart execution after swapping
	const spritesToRestart = new Set();

	await Promise.all(
		activeSprites.map(async sprite => {
			console.log(`🎭 [SPRITE:${sprite.id}] Starting execution with ${sprite.scripts.length} scripts`);
			const node = document.querySelector(`[data-sprite-id="${sprite.id}"]`);
			if (!node) {
				console.warn(`⚠️ [SPRITE:${sprite.id}] DOM node not found!`);
				return;
			}

			let i = sprite.currentIndex || 0;
			console.log(`📍 [SPRITE:${sprite.id}] Starting at script index ${i}`);

			while (true) {
				const freshState = getState().sprites;
				const updatedSprite = freshState.activeSprites.find(s => s.id === sprite.id);
				if (!updatedSprite) {
					console.warn(`⚠️ [SPRITE:${sprite.id}] Sprite not found in state, breaking loop`);
					break;
				}

				const scripts = updatedSprite.scripts;

				// Check if sprite was marked for restart due to script swapping
				if (spritesToRestart.has(sprite.id)) {
					console.log(`🔄 [SPRITE:${sprite.id}] Restarting execution due to script swap`);
					spritesToRestart.delete(sprite.id);
					i = 0; // Reset to beginning
				}

				if (!scripts || i >= scripts.length) {
					// Check if this sprite might have received new scripts due to collision
					if (scripts && scripts.length > 0 && i >= scripts.length) {
						console.log(`✅ [SPRITE:${sprite.id}] Completed all scripts (${scripts.length} total)`);
						// In hero mode, continue monitoring for new scripts
						if (isHeroModeEnabled) {
							await new Promise(resolve => setTimeout(resolve, 100));
							continue;
						} else {
							break;
						}
					} else if (!scripts || scripts.length === 0) {
						console.log(`💤 [SPRITE:${sprite.id}] No scripts to execute, waiting for potential swaps...`);
						// If hero mode is enabled and we have no scripts, wait a bit for potential swaps
						if (isHeroModeEnabled && !updatedSprite.collisionCooldown) {
							await new Promise(resolve => setTimeout(resolve, 100));
							continue; // Check again for new scripts
						} else {
							break;
						}
					}
					break;
				}

				console.log(`🔄 [SPRITE:${sprite.id}] Executing script ${i + 1}/${scripts.length}: ${scripts[i].type}`);

				// Wait if there's a global collision cooldown
				if (globalCollisionCooldown) {
					console.log(`⏸️ [SPRITE:${sprite.id}] Waiting for global collision cooldown...`);
					await new Promise(resolve => setTimeout(resolve, 50));
					continue;
				}

				// Skip if sprite is in collision cooldown
				if (updatedSprite.collisionCooldown) {
					console.log(`❄️ [SPRITE:${sprite.id}] In collision cooldown, clearing...`);
					await new Promise(resolve => setTimeout(resolve, 200));
					dispatch(spriteSlice.actions.clearCollisionCooldown({ spriteId: sprite.id }));
					globalCollisionCooldown = false;
					console.log(`🔓 [SPRITE:${sprite.id}] Collision cooldown cleared, continuing...`);
					continue;
				}

				// Check collisions before each action (only if no global cooldown)
				if (isHeroModeEnabled && !updatedSprite.shouldSwapScriptsWith && !globalCollisionCooldown) {
					console.log(`🔍 [SPRITE:${sprite.id}] Checking for collisions...`);
					dispatch(spriteSlice.actions.checkCollisions());
				}

				// Handle script swapping if collision occurred
				const freshSpriteAfterCollision = getState().sprites.activeSprites.find(s => s.id === sprite.id);
				if (isHeroModeEnabled && freshSpriteAfterCollision.shouldSwapScriptsWith) {
					const partnerId = freshSpriteAfterCollision.shouldSwapScriptsWith;
					const partner = getState().sprites.activeSprites.find(s => s.id === partnerId);

					if (partner && !partner.collisionCooldown && !globalCollisionCooldown) {
						console.log(`🎯 [COLLISION] DETECTED: ${sprite.id} with ${partnerId}`);
						console.log(`📍 [COLLISION] ${sprite.id} at script index ${i}, ${partnerId} at script index ${partner.currentIndex}`);
						console.log(`🔄 [COLLISION] Setting global cooldown and initiating swap...`);

						// Store current index before swap
						const currentSpriteIndex = i;
						const partnerIndex = partner.currentIndex;

						// Set global collision cooldown to prevent multiple simultaneous collisions
						globalCollisionCooldown = true;

						dispatch(
							spriteSlice.actions.swapSpriteScripts({
								sprite1Id: sprite.id,
								sprite2Id: partnerId,
								currentIndex1: currentSpriteIndex,
								currentIndex2: partnerIndex,
							})
						);

						// Mark both sprites to restart with their new scripts
						spritesToRestart.add(sprite.id);
						spritesToRestart.add(partnerId);

						// Continue from the beginning of the newly swapped scripts
						// This ensures we see the animation of the swapped behavior
						i = 0;
						console.log(`🔄 [COLLISION] ${sprite.id} restarting from index 0 with swapped scripts`);

						// Wait for swap to complete and collision cooldown
						console.log(`⏳ [COLLISION] Waiting 500ms for swap completion...`);
						await new Promise(resolve => setTimeout(resolve, 500));
						globalCollisionCooldown = false;
						console.log(`✅ [COLLISION] Global cooldown cleared, continuing execution`);
						continue;
					} else {
						console.log(`⚠️ [COLLISION] Swap conditions not met - partner: ${!!partner}, partner.collisionCooldown: ${partner?.collisionCooldown}, globalCooldown: ${globalCollisionCooldown}`);
					}
				}

				const script = scripts[i];
				console.log(`⚡ [SPRITE:${sprite.id}] Executing: ${script.type} with params:`, {
					steps: script.steps,
					degrees: script.degrees,
					text: script.text,
					seconds: script.seconds,
					x: script.x,
					y: script.y,
				});
				dispatch(spriteSlice.actions.setCurrentIndex({ spriteId: sprite.id, index: i }));

				const currentSprite = getState().sprites.activeSprites.find(s => s.id === sprite.id);
				console.log(`📍 [SPRITE:${sprite.id}] Current position: (${currentSprite.x}, ${currentSprite.y}), rotation: ${currentSprite.rotation}°`);

				switch (script.type) {
					case 'moveXsteps': {
						const steps = script.steps || 10;
						const newX = currentSprite.x + steps;
						console.log(`🚶‍♂️ [SPRITE:${sprite.id}] Moving X by ${steps} steps: ${currentSprite.x} → ${newX}`);

						await gsap.to(node, {
							duration: 0.5,
							left: `calc(50% + ${newX}px)`,
							ease: 'power2.out',
						});

						dispatch(spriteSlice.actions.moveXsteps({ spriteId: sprite.id, steps }));
						console.log(`✅ [SPRITE:${sprite.id}] X movement completed`);
						break;
					}
					case 'moveYsteps': {
						const steps = script.steps || 10;
						const newY = currentSprite.y + steps;
						console.log(`🚶‍♀️ [SPRITE:${sprite.id}] Moving Y by ${steps} steps: ${currentSprite.y} → ${newY}`);

						await gsap.to(node, {
							duration: 0.5,
							top: `calc(50% + ${newY}px)`,
							ease: 'power2.out',
						});

						dispatch(spriteSlice.actions.moveYsteps({ spriteId: sprite.id, steps }));
						console.log(`✅ [SPRITE:${sprite.id}] Y movement completed`);
						break;
					}
					case 'turnDegrees': {
						const degrees = script.degrees || 15;
						const newRotation = currentSprite.rotation + degrees;
						console.log(`🔄 [SPRITE:${sprite.id}] Rotating by ${degrees}°: ${currentSprite.rotation}° → ${newRotation}°`);

						await gsap.to(node, {
							duration: 0.4,
							rotation: newRotation,
							ease: 'power2.out',
						});

						dispatch(spriteSlice.actions.turnDegrees({ spriteId: sprite.id, degrees }));
						console.log(`✅ [SPRITE:${sprite.id}] Rotation completed`);
						break;
					}
					case 'goToXY': {
						const targetX = script.x || 0;
						const targetY = script.y || 0;
						console.log(`🎯 [SPRITE:${sprite.id}] Going to position (${targetX}, ${targetY}) from (${currentSprite.x}, ${currentSprite.y})`);

						await gsap.to(node, {
							duration: 0.6,
							left: `calc(50% + ${targetX}px)`,
							top: `calc(50% + ${targetY}px)`,
							ease: 'power2.out',
						});

						dispatch(spriteSlice.actions.goToXY({ spriteId: sprite.id, x: targetX, y: targetY }));
						console.log(`✅ [SPRITE:${sprite.id}] Position change completed`);
						break;
					}
					case 'sayForSeconds':
						console.log(`💬 [SPRITE:${sprite.id}] Saying "${script.text || 'Hello!'}" for ${script.seconds || 2} seconds`);
						dispatch(
							spriteSlice.actions.sayForSeconds({
								spriteId: sprite.id,
								text: script.text || 'Hello!',
								seconds: script.seconds || 2,
							})
						);
						await new Promise(resolve => setTimeout(resolve, (script.seconds || 2) * 1000));
						dispatch(spriteSlice.actions.clearSayText({ spriteId: sprite.id }));
						console.log(`✅ [SPRITE:${sprite.id}] Say completed`);
						break;
					case 'thinkForSeconds':
						console.log(`💭 [SPRITE:${sprite.id}] Thinking "${script.text || 'Hmm...'}" for ${script.seconds || 2} seconds`);
						dispatch(
							spriteSlice.actions.thinkForSeconds({
								spriteId: sprite.id,
								text: script.text || 'Hmm...',
								seconds: script.seconds || 2,
							})
						);
						await new Promise(resolve => setTimeout(resolve, (script.seconds || 2) * 1000));
						dispatch(spriteSlice.actions.clearThinkText({ spriteId: sprite.id }));
						console.log(`✅ [SPRITE:${sprite.id}] Think completed`);
						break;
					default:
						console.warn(`⚠️ [SPRITE:${sprite.id}] Unknown script type: ${script.type}`);
						break;
				}

				i++;
				console.log(`➡️ [SPRITE:${sprite.id}] Moving to next script (index ${i})`);

				// Add a small delay between script executions to ensure animations are visible
				// and state updates are properly processed
				await new Promise(resolve => setTimeout(resolve, 400));
			}
			console.log(`🏁 [SPRITE:${sprite.id}] Finished execution loop`);
		})
	);

	console.log('🧹 [SCRIPT EXECUTION] Cleaning up and resetting sprites...');
	// Reset all sprites
	const finalSprites = getState().sprites.activeSprites;
	finalSprites.forEach(sprite => {
		console.log(`🔄 [SPRITE:${sprite.id}] Resetting to index 0 and clearing cooldown`);
		dispatch(spriteSlice.actions.setCurrentIndex({ spriteId: sprite.id, index: 0 }));
		dispatch(spriteSlice.actions.clearCollisionCooldown({ spriteId: sprite.id }));
	});

	dispatch(spriteSlice.actions.stopScripts());
	console.log('🎬 [SCRIPT EXECUTION] All scripts completed successfully!');
});

export const {
	setStageSize,
	addSprite,
	setActiveSprite,
	toggleHeroMode,
	addScriptToSprite,
	removeScriptFromSprite,
	reorderScripts,
	removeSprite,
	renameSprite,
	goToXY,
	toggleVisibility,
	resizeSprite,
	rotatesprite,
	moveXsteps,
	moveYsteps,
	checkCollisions,
	clearSayText,
	clearThinkText,
	markSpritesForSwap,
	runScripts,
	sayForSeconds,
	stopScripts,
	thinkForSeconds,
	turnDegrees,
	setCurrentIndex,
	swapSpriteScripts,
} = spriteSlice.actions;
export default spriteSlice.reducer;
