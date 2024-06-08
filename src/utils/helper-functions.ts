
export function isEmpty(obj: any) {
	let isEmpty = false;
	const type = typeof obj;
	isEmpty = isEmpty || !obj;
	isEmpty = isEmpty || type === 'undefined'; // if it is undefined
	isEmpty = isEmpty || obj === null; // if it is null
	isEmpty = isEmpty || (type === 'string' && obj.trim() === ''); // if the string is empty or only have spaces
	isEmpty = isEmpty || obj === false || obj === 0; // if boolean value returns false
	isEmpty = isEmpty || (Array.isArray(obj) && obj.length === 0); // if array is empty
	isEmpty = isEmpty || (type === 'object' && Object.keys(obj).length === 0); // if object is empty
	return isEmpty;
}

export const deepClone = (data: any = {}) => {
	return JSON.parse(JSON.stringify(data))
}

export const emptyFunction = () => { };


export const debounce = <T extends (...args: any[]) => void>(func: T, delay: number = 500) => {
	let timeoutId: ReturnType<typeof setTimeout>;

	return function (...args: Parameters<T>) {
		clearTimeout(timeoutId);

		timeoutId = setTimeout(() => {
			func(...args);
		}, delay);
	};
};

export const getInitials = (name: string) => {
	if (name !== undefined && name !== null) {
		var parts = name.split(' ')
		var initials = ''
		for (var i = 0; i < parts.length; i++) {
			if (parts[i].length > 0 && parts[i] !== '') {
				initials += parts[i][0].toUpperCase()
			}
		}
		return initials
	}
}

export function keyExists(key: string, obj: any) {
	if ((Array.isArray(obj) && key in obj) || (obj instanceof Object && Object.prototype.hasOwnProperty.call(obj, key))) {
		return true;
	}
	return false;
}
