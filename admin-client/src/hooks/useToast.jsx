import { toast } from 'react-hot-toast';

export const showToast = async(message, type, duration = 5000) => {
    toast[type](
        <span style={{ fontWeight: 'bold' }}>
            {message}
        </span>,
        { duration }
    );
};
