import axios from "axios";

const trySilentRefresh = async () => {
    try {
        const res = await axios.post(`/auth/refreshToken`, { withCredentials: true });
        if (res.data.success) {
            return {
                user: res.data.ref,
                accessToken: res.data.accessToken
            };
        }
        return null;
    } catch (err) {
        const mute = err;
    }
};

export {
    trySilentRefresh
}