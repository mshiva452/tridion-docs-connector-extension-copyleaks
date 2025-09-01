import type { ExtensionModule, RuntimeInformation } from '@tridion-docs/extensions';

import '../theme/_variables.css';

import packageJson from '../package.json';
import { Copyleaks } from './Copyleaks';
import { CopyleaksIcon } from './CopyleaksIcon';
import { ObjectInsightItemExtensionsVisibilityConfiguration, FolderType } from '@tridion-docs/extensions';
import { initializeGlobals } from './globals';

const extensionModule: ExtensionModule = {
    runtimeInfo: packageJson as RuntimeInformation,
    initializeGlobals,
    initialize: builder => {
        builder.objectInsight.addObjectInsightItem(() => ({
            id: 'copyleaks-insight-id',
            tooltip: 'Copyleaks',
            isVisible: (props: ObjectInsightItemExtensionsVisibilityConfiguration) => {
                return props.activeView==="Explore" && props.contextFolder?.folderType===FolderType.TopicFolder && props.activeItem?.type==="DocumentObject";
            },
            icon: CopyleaksIcon,
            component: Copyleaks,
        }));
    },
};

export default extensionModule;
