// 简历上传组件模块
// 处理简历文件的上传和解析
// 已迁移到新架构：使用 StorageService、NotificationService

/**
 * 初始化简历上传功能
 */
function initResumeUpload() {
    safeExecute(function() {
        console.log('Initializing resume upload functionality');
        
        // 使用新架构的服务
        const storage = window.OfferLaolao?.Services?.StorageService;
        const notification = window.OfferLaolao?.Services?.NotificationService;
        const Constants = window.OfferLaolao?.Config?.Constants;
        
        // 兼容旧代码
        const showNotify = notification 
            ? (msg, type) => notification.show(msg, type)
            : (typeof showNotification === 'function' ? showNotification : () => {});
        const loadData = storage 
            ? (key) => storage.loadSync(key, {})
            : (typeof loadDataFromStorage === 'function' ? loadDataFromStorage : () => ({}));
        
        const dropArea = document.getElementById('drop-area');
        const fileInput = document.getElementById('file-input');
        const parseResultDiv = document.getElementById('parse-result');
        
        if (!dropArea || !fileInput) {
            console.warn('Resume upload elements not found in DOM');
            return;
        }
        
        // 设置拖放事件
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropArea.addEventListener(eventName, preventDefaults, false);
        });
        
        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }
        
        // 为拖放区域添加高亮效果
        ['dragenter', 'dragover'].forEach(eventName => {
            dropArea.addEventListener(eventName, highlight, false);
        });
        
        ['dragleave', 'drop'].forEach(eventName => {
            dropArea.addEventListener(eventName, unhighlight, false);
        });
        
        function highlight() {
            dropArea.style.borderColor = '#1890ff';
            dropArea.style.backgroundColor = '#f0f9ff';
        }
        
        function unhighlight() {
            dropArea.style.borderColor = '#d9d9d9';
            dropArea.style.backgroundColor = '';
        }
        
        // 处理文件拖放
        dropArea.addEventListener('drop', handleDrop, false);
        
        function handleDrop(e) {
            const dt = e.dataTransfer;
            const files = dt.files;
            handleFiles(files);
        }
        
        // 处理文件选择
        fileInput.addEventListener('change', function() {
            handleFiles(this.files);
        });
        
        // 当点击拖放区域时，触发文件输入点击
        dropArea.addEventListener('click', function() {
            fileInput.click();
        });
        
        // 暂存解析的数据
        var parsedResumeData = null;
        
        // 处理文件上传
        function handleFiles(files) {
            if (files.length > 0) {
                const file = files[0];
                console.log('Processing file:', file.name);
                
                const allowedExtensions = ['.json', '.pdf', '.doc', '.docx', '.txt', '.html'];
                const fileExtension = file.name.toLowerCase().substr(file.name.lastIndexOf('.'));
                
                if (allowedExtensions.includes(fileExtension)) {
                    showNotify('正在解析简历文件，请稍候...', 'info');
                    
                    // 如果是JSON文件，直接解析
                    if (fileExtension === '.json' || file.type === 'application/json') {
                        const reader = new FileReader();
                        reader.onload = function(e) {
                            try {
                                const jsonData = JSON.parse(e.target.result);
                                parsedResumeData = jsonData;
                                
                                if (parseResultDiv) {
                                    parseResultDiv.innerHTML = 
                                        '<div style="padding: 15px; background: #f0f9ff; border: 1px solid #1890ff; border-radius: 4px;">' +
                                        '<p style="color: #1890ff; margin: 0 0 10px 0; font-weight: 500;">✓ JSON文件解析成功！</p>' +
                                        '<p style="color: #666; margin: 0 0 15px 0; font-size: 12px;">文件名: ' + file.name + '</p>' +
                                        '<button id="use-parsed-data-btn" style="background: #1890ff; color: white; border: none; border-radius: 4px; padding: 8px 20px; cursor: pointer; font-size: 14px; width: 100%;">使用解析数据</button>' +
                                        '</div>';
                                    
                                    const useDataBtn = document.getElementById('use-parsed-data-btn');
                                    if (useDataBtn) {
                                        useDataBtn.addEventListener('click', function() {
                                            fillFormWithParsedData(parsedResumeData);
                                        });
                                    }
                                }
                                
                                showNotify('JSON文件解析成功！点击"使用解析数据"按钮填充表单', 'success');
                            } catch (error) {
                                console.error('JSON parse error:', error);
                                showNotify('JSON文件解析失败，请检查文件格式', 'error');
                                if (parseResultDiv) {
                                    parseResultDiv.innerHTML = '<p style="color: red;">JSON文件解析失败：' + error.message + '</p>';
                                }
                            }
                        };
                        reader.readAsText(file);
                    } else {
                        // 其他格式的文件（PDF、DOCX等），调用API解析
                        showNotify('文件已上传，正在调用API解析...', 'info');
                        
                        // 获取简历解析API配置
                        // 使用安全的函数调用，如果函数不存在则使用备用方法
                        var apiConfig = null;
                        try {
                            if (typeof getParseAPIConfig === 'function') {
                                apiConfig = getParseAPIConfig();
                            } else if (typeof window !== 'undefined' && typeof window.getParseAPIConfig === 'function') {
                                apiConfig = window.getParseAPIConfig();
                            } else {
                                // 如果函数不存在，尝试直接从存储中读取
                                console.warn('getParseAPIConfig not found, trying to load from storage directly');
                                const parseSettingsKey = Constants?.STORAGE_KEYS?.PARSE_SETTINGS || 'parseSettings';
                                var parseSettings = loadData(parseSettingsKey);
                                apiConfig = {
                                    url: parseSettings.url || '',
                                    appCode: parseSettings.appCode || ''
                                };
                            }
                        } catch (error) {
                            console.error('Error getting API config:', error);
                            showNotify('获取API配置失败: ' + error.message, 'error');
                            if (parseResultDiv) {
                                parseResultDiv.innerHTML = 
                                    '<div style="padding: 15px; background: #fff1f0; border: 1px solid #ff4d4f; border-radius: 4px;">' +
                                    '<p style="color: #ff4d4f; margin: 0 0 10px 0; font-weight: 500;">✗ 错误</p>' +
                                    '<p style="color: #666; margin: 0; font-size: 12px;">获取API配置失败: ' + error.message + '</p>' +
                                    '</div>';
                            }
                            return;
                        }
                        
                        if (!apiConfig.url || !apiConfig.appCode) {
                            showNotify('请先在设置中配置简历解析API URL和APP Code', 'error');
                            if (parseResultDiv) {
                                parseResultDiv.innerHTML = 
                                    '<div style="padding: 15px; background: #fff7e6; border: 1px solid #ff9800; border-radius: 4px;">' +
                                    '<p style="color: #ff9800; margin: 0 0 10px 0; font-weight: 500;">⚠ 需要配置简历解析API</p>' +
                                    '<p style="color: #666; margin: 0 0 10px 0; font-size: 12px;">请在"设置"标签页的"简历解析算法配置"中配置API URL和APP Code</p>' +
                                    '<p style="color: #999; margin: 0; font-size: 11px;">参考：<a href="https://market.aliyun.com/detail/cmapi034316" target="_blank" style="color: #1890ff;">阿里云市场简历解析API</a></p>' +
                                    '</div>';
                            }
                            return;
                        }
                        
                        // 显示解析进度
                        if (parseResultDiv) {
                            parseResultDiv.innerHTML = 
                                '<div style="padding: 15px; background: #f0f9ff; border: 1px solid #1890ff; border-radius: 4px;">' +
                                '<p style="color: #1890ff; margin: 0 0 10px 0; font-weight: 500;">正在解析简历...</p>' +
                                '<p style="color: #666; margin: 0; font-size: 12px;">文件名: ' + file.name + '</p>' +
                                '<div style="margin-top: 10px; width: 100%; height: 4px; background: #e6f7ff; border-radius: 2px; overflow: hidden;">' +
                                '<div id="parse-progress" style="width: 0%; height: 100%; background: #1890ff; transition: width 0.3s;"></div>' +
                                '</div>' +
                                '</div>';
                        }
                        
                        // 获取parseResumeByAPI函数（尝试多种方式，包括延迟检查）
                        function tryParseResume() {
                            var parseResumeFunc = null;
                            
                            // 尝试直接访问
                            if (typeof parseResumeByAPI === 'function') {
                                parseResumeFunc = parseResumeByAPI;
                            } else if (typeof window !== 'undefined' && typeof window.parseResumeByAPI === 'function') {
                                parseResumeFunc = window.parseResumeByAPI;
                            }
                            
                            if (!parseResumeFunc) {
                                // 如果函数不存在，尝试延迟重试（可能是脚本加载时序问题）
                                console.warn('parseResumeByAPI not found, retrying in 100ms...');
                                setTimeout(function() {
                                    var retryFunc = null;
                                    if (typeof parseResumeByAPI === 'function') {
                                        retryFunc = parseResumeByAPI;
                                    } else if (typeof window !== 'undefined' && typeof window.parseResumeByAPI === 'function') {
                                        retryFunc = window.parseResumeByAPI;
                                    }
                                    
                                    if (retryFunc) {
                                        retryFunc(file, apiConfig.url, apiConfig.appCode)
                                            .then(function(result) {
                                                handleParseSuccess(result, file, parseResultDiv);
                                            })
                                            .catch(function(error) {
                                                handleParseError(error, parseResultDiv);
                                            });
                                    } else {
                                        console.error('parseResumeByAPI function still not found after retry');
                                        console.error('Available functions:', Object.keys(window).filter(function(k) {
                                            return k.includes('parse') || k.includes('API') || k.includes('Resume');
                                        }));
                                        showNotify('API解析函数未加载，请刷新扩展后重试', 'error');
                                        if (parseResultDiv) {
                                            parseResultDiv.innerHTML = 
                                                '<div style="padding: 15px; background: #fff1f0; border: 1px solid #ff4d4f; border-radius: 4px;">' +
                                                '<p style="color: #ff4d4f; margin: 0 0 10px 0; font-weight: 500;">✗ 错误</p>' +
                                                '<p style="color: #666; margin: 0; font-size: 12px;">API解析函数未加载，请刷新扩展后重试</p>' +
                                                '<p style="color: #999; margin-top: 5px; font-size: 11px;">请检查浏览器控制台的错误信息</p>' +
                                                '</div>';
                                        }
                                    }
                                }, 100);
                                return;
                            }
                            
                            // 调用API解析
                            parseResumeFunc(file, apiConfig.url, apiConfig.appCode)
                                .then(function(result) {
                                    handleParseSuccess(result, file, parseResultDiv);
                                })
                                .catch(function(error) {
                                    handleParseError(error, parseResultDiv);
                                });
                        }
                        
                        // 处理解析成功的回调
                        function handleParseSuccess(result, file, parseResultDiv) {
                            console.log('API解析成功:', result);
                            parsedResumeData = result;
                            
                            // 更新进度条
                            const progressBar = document.getElementById('parse-progress');
                            if (progressBar) {
                                progressBar.style.width = '100%';
                            }
                            
                            // 显示解析结果
                            setTimeout(function() {
                                if (parseResultDiv) {
                                    parseResultDiv.innerHTML = 
                                        '<div style="padding: 15px; background: #f6ffed; border: 1px solid #52c41a; border-radius: 4px;">' +
                                        '<p style="color: #52c41a; margin: 0 0 10px 0; font-weight: 500;">✓ 文件解析成功！</p>' +
                                        '<p style="color: #666; margin: 0 0 15px 0; font-size: 12px;">文件名: ' + file.name + '</p>' +
                                        '<button id="use-parsed-data-btn" style="background: #52c41a; color: white; border: none; border-radius: 4px; padding: 8px 20px; cursor: pointer; font-size: 14px; width: 100%;">使用解析数据</button>' +
                                        '</div>';
                                    
                                    const useDataBtn = document.getElementById('use-parsed-data-btn');
                                    if (useDataBtn) {
                                        useDataBtn.addEventListener('click', function() {
                                            fillFormWithParsedData(parsedResumeData);
                                        });
                                    }
                                }
                                
                                showNotify('文件解析成功！点击"使用解析数据"按钮填充表单', 'success');
                            }, 300);
                        }
                        
                        // 处理解析错误的回调
                        function handleParseError(error, parseResultDiv) {
                            console.error('API解析失败:', error);
                            
                            // 显示错误信息
                            if (parseResultDiv) {
                                parseResultDiv.innerHTML = 
                                    '<div style="padding: 15px; background: #fff1f0; border: 1px solid #ff4d4f; border-radius: 4px;">' +
                                    '<p style="color: #ff4d4f; margin: 0 0 10px 0; font-weight: 500;">✗ 解析失败</p>' +
                                    '<p style="color: #666; margin: 0 0 10px 0; font-size: 12px;">错误信息: ' + (error.message || '未知错误') + '</p>' +
                                    '<p style="color: #999; margin: 0; font-size: 11px;">请检查API配置或文件格式是否正确</p>' +
                                    '</div>';
                            }
                            
                            showNotify('文件解析失败: ' + (error.message || '未知错误'), 'error');
                        }
                        
                        // 开始尝试解析
                        tryParseResume();
                    }
                } else {
                    showNotify('不支持的文件格式，请上传PDF、Word、JSON或文本文档。', 'error');
                    if (parseResultDiv) {
                        parseResultDiv.innerHTML = '<p style="color: red;">不支持的文件格式</p>';
                    }
                }
            }
        }
        
        console.log('Resume upload initialization completed');
    }, this);
}

