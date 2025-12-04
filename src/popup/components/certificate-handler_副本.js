// 证书处理模块
// 处理技能证书的上传和删除

/**
 * 处理证书上传
 * @param {HTMLElement} fileInput - 文件输入元素
 */
function handleCertificateUpload(fileInput) {
    if (fileInput.files && fileInput.files[0]) {
        var file = fileInput.files[0];
        var reader = new FileReader();
        
        reader.onload = function(e) {
            var preview = fileInput.closest('.file-upload-container').querySelector('.certificate-preview');
            if (preview) {
                preview.style.display = 'block';
                preview.innerHTML = '<img src="' + e.target.result + '" alt="证书预览" style="max-width: 100%; height: auto;">';
                
                // 添加删除按钮到预览
                var removeBtn = document.createElement('button');
                removeBtn.className = 'remove-certificate-btn';
                removeBtn.textContent = '删除';
                removeBtn.style.cssText = 'margin-top: 8px; padding: 4px 8px; background: #ff4d4f; color: white; border: none; border-radius: 4px; cursor: pointer;';
                removeBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    var previewDiv = this.closest('.certificate-preview');
                    var fileInput = previewDiv.closest('.file-upload-container').querySelector('.skill-certificate-upload');
                    removeCertificate(fileInput, previewDiv);
                    // 删除证书后触发自动保存
                    if (typeof autoSaveFormData === 'function') {
                        autoSaveFormData();
                    }
                });
                
                preview.appendChild(removeBtn);
            }
            
            // 触发自动保存
            if (typeof autoSaveFormData === 'function') {
                autoSaveFormData();
            }
        };
        
        reader.readAsDataURL(file);
    }
}

/**
 * 移除证书
 * @param {HTMLElement} fileInput - 文件输入元素
 * @param {HTMLElement} previewDiv - 预览容器元素
 */
function removeCertificate(fileInput, previewDiv) {
    if (fileInput) {
        fileInput.value = '';
    }
    if (previewDiv) {
        previewDiv.style.display = 'none';
        previewDiv.innerHTML = '';
    }
}

// 导出函数
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { 
        handleCertificateUpload, 
        removeCertificate 
    };
}

