// 辅助工具模块
// 提供通用的辅助函数

/**
 * 防抖函数
 * @param {Function} func - 要防抖的函数
 * @param {number} wait - 等待时间（毫秒）
 * @returns {Function} 防抖后的函数
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func.apply(this, args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * 安全执行函数包装器
 * @param {Function} func - 要执行的函数
 * @param {any} context - 执行上下文
 * @param {Array} args - 函数参数
 * @param {any} fallbackValue - 失败时的默认返回值
 * @returns {any} 函数执行结果或默认值
 */
function safeExecute(func, context, args = [], fallbackValue = null) {
    try {
        console.log(`执行安全包装的函数: ${func.name || '匿名函数'}`);
        return func.apply(context, args);
    } catch (error) {
        console.error(`安全执行失败: ${func.name || '匿名函数'}`, error);
        if (typeof showNotification !== 'undefined') {
            showNotification(`操作执行出错: ${error.message}`, 'error');
        }
        return fallbackValue;
    }
}

/**
 * 安全的DOM查询函数
 * @param {HTMLElement} element - 查询的根元素
 * @param {string} selector - CSS选择器
 * @returns {HTMLElement|null} 找到的元素或null
 */
function safeQuerySelector(element, selector) {
    try {
        // 验证选择器安全性
        if (typeof selector !== 'string' || !selector) {
            console.warn('无效的选择器参数:', selector);
            return null;
        }
        
        // 基本选择器安全检查
        if (selector.includes('[') && selector.includes(']') && selector.includes('#')) {
            console.warn('可能不安全的选择器格式:', selector);
            // 尝试转换为更安全的属性选择器
            const saferSelector = selector.replace(/^#([\w-]+)\[([\w-]+)\]$/, '[id="$1"][name="$2"]');
            console.log(`转换为更安全的选择器: ${saferSelector}`);
            return element.querySelector(saferSelector);
        }
        
        return element.querySelector(selector);
    } catch (error) {
        console.error(`选择器查询错误: ${selector}`, error);
        return null;
    }
}

/**
 * 检查动态项是否为空
 * @param {HTMLElement} item - 动态项元素
 * @returns {boolean} 是否为空
 */
function isItemEmpty(item) {
    if (!item) return true;
    
    var inputs = item.querySelectorAll('input, select, textarea');
    for (var i = 0; i < inputs.length; i++) {
        var input = inputs[i];
        
        // 跳过文件输入（文件输入不能通过value检查）
        if (input.type === 'file') {
            // 检查文件输入是否有文件
            if (input.files && input.files.length > 0) {
                return false; // 有文件，不是空的
            }
            continue;
        }
        
        // 检查其他输入字段是否有值
        var value = input.value;
        if (value !== null && value !== undefined && value !== '') {
            return false; // 有值，不是空的
        }
    }
    
    return true; // 所有字段都为空
}

// 导出函数
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { 
        debounce, 
        safeExecute, 
        safeQuerySelector,
        isItemEmpty 
    };
}

