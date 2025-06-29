import React from 'react';
import App from './App';
import 'tailwindcss/tailwind.css';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
	<React.StrictMode>
		<DndProvider backend={HTML5Backend}>
			<Provider store={store}>
				<App />
			</Provider>
		</DndProvider>
	</React.StrictMode>
);
