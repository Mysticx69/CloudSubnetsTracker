import React, { useState } from 'react';
import { CloudProvider } from '../types/Project';
import { Box } from '@mui/material';
import CloudIcon from '@mui/icons-material/Cloud';
import StorageIcon from '@mui/icons-material/Storage';

interface ProviderIconProps {
    provider: CloudProvider;
}

const ProviderIcon: React.FC<ProviderIconProps> = ({ provider }) => {
    const [imageError, setImageError] = useState(false);

    const getFallbackIcon = () => {
        switch (provider) {
            case 'AWS':
                return (
                    <svg viewBox="0 0 24 24" style={{ width: 24, height: 24 }}>
                        <path d="M13.7 10.4c0 .6-.5 1.1-1.1 1.1s-1.1-.5-1.1-1.1.5-1.1 1.1-1.1 1.1.5 1.1 1.1zm-3.3 9.3c-.7 0-1.4-.3-1.9-.8l-3-3c-.5-.5-.8-1.2-.8-1.9s.3-1.4.8-1.9l3-3c.5-.5 1.2-.8 1.9-.8s1.4.3 1.9.8l3 3c.5.5.8 1.2.8 1.9s-.3 1.4-.8 1.9l-3 3c-.5.5-1.2.8-1.9.8zm0-9.3c-.7 0-1.4.3-1.9.8l-3 3c-.5.5-.8 1.2-.8 1.9s.3 1.4.8 1.9l3 3c.5.5 1.2.8 1.9.8s1.4-.3 1.9-.8l3-3c.5-.5.8-1.2.8-1.9s-.3-1.4-.8-1.9l-3-3c-.5-.5-1.2-.8-1.9-.8z" fill="#FF9900"/>
                    </svg>
                );
            case 'OVH':
                return <StorageIcon sx={{ color: "#000E9C" }} />;
            case 'CloudAvenue':
                return <CloudIcon sx={{ color: "#FF7900" }} />;
            default:
                return <CloudIcon />;
        }
    };

    const getIcon = () => {
        if (imageError) {
            return getFallbackIcon();
        }

        switch (provider) {
            case 'AWS':
                return (
                    <Box
                        component="img"
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQSObhWW7gEGNs1r3kbEXIeWuIDC74C6p5RVQ&s"
                        alt="AWS"
                        sx={{ 
                            height: 12, 
                            width: 'auto',
                            objectFit: 'contain'
                        }}
                        onError={() => setImageError(true)}
                    />
                );
            case 'OVH':
                return (
                    <Box
                        component="img"
                        src="https://getlogovector.com/wp-content/uploads/2021/05/ovhcloud-logo-vector.png"
                        alt="OVH"
                        sx={{ 
                            height: 24, 
                            width: 'auto',
                            objectFit: 'contain'
                        }}
                        onError={() => setImageError(true)}
                    />
                );
            case 'CloudAvenue':
                return (
                    <Box
                        component="img"
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTtezznU_jVR9aLxxoGiGKPIuHKZhfGGuuqhg&s"
                        alt="CloudAvenue"
                        sx={{ 
                            height: 24, 
                            width: 'auto',
                            objectFit: 'contain'
                        }}
                        onError={() => setImageError(true)}
                    />
                );
        }
    };

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {getIcon()}
        </Box>
    );
};

export default ProviderIcon; 