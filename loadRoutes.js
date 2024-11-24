// loadRoutes.js
const fs = require('fs');
const path = require('path');

function loadRoutes(app, pluginsDir) {
    let routeArr = [];
    fs.readdirSync(pluginsDir).forEach((pluginDir) => {
        const pluginPath = path.join(pluginsDir, pluginDir);
        const pluginIndexPath = path.join(pluginPath, 'index.js');

        if (fs.existsSync(pluginIndexPath)) {
            // Load the plugin
            const plugin = require(pluginIndexPath);

            let routeName = pluginDir;
            // if other than this folder then make this start with /api/company/:companyId
            if (!['auth', 'company', 'settings'].includes(pluginDir)) {
                routeName = `company`;
            }

            app.use(`/api/${routeName}`, plugin);

            // print route
            let rarr = logRoutes(`/api/${routeName}`, plugin, arr = []);
            console.log(rarr);
            
            routeArr = [...routeArr, ...rarr]
        }
    });
    return routeArr;
}

const logRoutes = (preRoute, router, arr = []) => {
    router.stack.forEach(async (middleware) => {
        if (middleware.route) {
            // Routes
            // console.log(`Route: ${Object.keys(middleware.route.methods).join(', ').toUpperCase()} ${preRoute}${middleware.route.path}`);
            let doc = {
                method: Object.keys(middleware.route.methods).join(', ').toUpperCase(),
                path: `${preRoute}${middleware.route.path}`
            }
            arr.push(doc);
        } else if (middleware.name === 'router') {
            // Subrouters
            logRoutes(preRoute, middleware.handle, arr);
        }
    });
    return arr;
};

module.exports = loadRoutes;
