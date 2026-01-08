const {nativeTheme} = require("electron");

class ThemModesHandler {
    static getInitialThemeMode() {
        nativeTheme.themeSource = 'system';
        return nativeTheme.shouldUseDarkColors
    }

    static getDarkMode() {
        if (!nativeTheme.shouldUseDarkColors) nativeTheme.themeSource = 'dark'
        return nativeTheme.shouldUseDarkColors
    }

    static getLightMode() {
        if (nativeTheme.shouldUseDarkColors) nativeTheme.themeSource = 'light'
        return nativeTheme.shouldUseDarkColors
    }
}


module.exports = ThemModesHandler