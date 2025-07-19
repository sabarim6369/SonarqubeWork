import "./authpage.css";
import AdminIllustration from "../../assets/illustrations/businessman-is-doing-market-research.svg";
import AdminAuthCard from "../../components/AdminAuthCard/AdminAuthCard";

export default function AuthPage() {
    return (
        <div className="authpage-container">
            <div className="authpage-container-grid" />
            <div className="authpage-content">
                <div className="authpage-left admin-bg">
                    <div className="authpage-left-admin-top">
                        <img
                            loading="lazy"
                            src={AdminIllustration}
                            className="admin-illus-active"
                            alt="Admin Illustration"
                        />
                    </div>
                    <div className="authpage-left-bottom">
                        <div className="authpage-left-title">Lead the Way</div>
                        <div className="authpage-left-subtitle">
                            Strategize, manage, and drive impactful results.
                        </div>
                    </div>
                </div>
                <div className="authpage-right">
                    <AdminAuthCard />
                </div>
            </div>
        </div>
    );
}
