import { Sidebar } from "./Sidebar";
import { Content } from "antd/es/layout/layout";
import { Layout } from "antd";
import { withAuth } from "../hoc/withAuth";

interface IAppLayoutProps {
    children: any;
}

const AppLayout = ({ children }: IAppLayoutProps) => {
    return (
        <>
            <Layout style={{ minHeight: '100vh' }}>
                <Sidebar />

                <Layout style={{ background: "#001529" }}>
                    <Content
                        style={{
                            borderRadius: "16px",
                            background: "#1f1f1f",
                            margin: '48px',
                            padding: "24px",
                            overflow: 'initial',
                        }}
                    >
                        {children}
                    </Content>
                </Layout>

                <div className="bottom-navigation">
                    <Sidebar />
                </div>
            </Layout>
        </>
    );
};

export const AppProtectedLayout = withAuth(AppLayout);
