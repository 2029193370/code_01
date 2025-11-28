import { shallowRef, onMounted, onUnmounted, type ShallowRef } from 'vue';
import { store, type RootState, type AppDispatch } from '../store';

/**
 * Vue Composable: 使用 Redux Store
 * 
 * 这个 composable 提供了在 Vue 组件中使用 Redux 的方式
 * 类似于 React-Redux 的 useSelector 和 useDispatch
 */

/**
 * useSelector - 从 Redux Store 中选择状态
 * 
 * @param selector 选择器函数
 * @returns 响应式的状态引用
 * 
 * @example
 * const books = useSelector(state => state.books.books);
 */
export function useSelector<T>(selector: (state: RootState) => T): ShallowRef<T> {
  const state = shallowRef(selector(store.getState())) as ShallowRef<T>;
  
  let unsubscribe: (() => void) | null = null;

  const updateState = () => {
    const newState = selector(store.getState());
    state.value = newState;
  };

  onMounted(() => {
    // 订阅 store 变化
    unsubscribe = store.subscribe(updateState);
    // 初始更新
    updateState();
  });

  onUnmounted(() => {
    // 取消订阅
    if (unsubscribe) {
      unsubscribe();
    }
  });

  return state;
}

/**
 * useDispatch - 获取 Redux dispatch 函数
 * 
 * @returns dispatch 函数
 * 
 * @example
 * const dispatch = useDispatch();
 * dispatch(addBook({ title: '新书', ... }));
 */
export function useDispatch(): AppDispatch {
  return store.dispatch;
}

/**
 * useStore - 获取整个 Redux Store
 * 
 * @returns Redux store 实例
 */
export function useStore() {
  return store;
}

