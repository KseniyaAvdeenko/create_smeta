const {nativeTheme} = require("electron");

class ThemModesHandler {
    static getInitialThemeMode() {
        nativeTheme.themeSource = 'system';
        return nativeTheme.shouldUseDarkColors
    }

    static getDarkMode(callback=null) {
        if (!nativeTheme.shouldUseDarkColors) nativeTheme.themeSource = 'dark'
        if(callback) callback();        
        return nativeTheme.shouldUseDarkColors
    }

    static getLightMode(callback=null) {
        if (nativeTheme.shouldUseDarkColors) nativeTheme.themeSource = 'light'
        if(callback) callback();
        return nativeTheme.shouldUseDarkColors
    }
}


module.exports = ThemModesHandler