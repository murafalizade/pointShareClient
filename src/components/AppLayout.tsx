import { Sidebar } from "./Sidebar";
import { Content } from "antd/es/layout/layout";
import { Layout } from "antd";
import { withAuth } from "../hoc/withAuth";
import React from "react";

interface IAppLayoutProps {
    children: React.ReactNode;
}

const AppLayout = ({ children }: IAppLayoutProps) => {
    return (
        <>
            <Layout style={{ minHeight: '100vh' }}>
                <Sidebar />

                <Layout style={{ background: "#001529" }}>
                    <Content className={'layout-content'}>
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
